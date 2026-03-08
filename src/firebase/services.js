// src/firebase/services.js
import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, where, orderBy, limit, serverTimestamp, onSnapshot
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from './config';

// ── HELPERS ──────────────────────────────────────────────────
export const generateTrackId = () => {
  const part1 = Math.random().toString(36).substring(2, 12).toUpperCase();
  const part2 = Math.floor(100000 + Math.random() * 900000);
  return `EXPS-${part1}-${part2}`;
};

// ── AUTH ─────────────────────────────────────────────────────
export const loginUser    = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logoutUser   = () => fbSignOut(auth);
export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

export const getUserProfile = async (uid) => {
  const q = query(collection(db, 'users'), where('uid', '==', uid));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
};

// ── FILE UPLOAD ───────────────────────────────────────────────
export const uploadFile = (file, reportId, onProgress) =>
  new Promise((resolve, reject) => {
    const storageRef = ref(storage, `evidence/${reportId}/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      snap => onProgress?.(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, name: file.name, size: file.size, type: file.type });
      }
    );
  });

// ── SUBMIT REPORT ─────────────────────────────────────────────
export const submitReport = async (data, files = [], onProgress) => {
  // Generate trackId — entropy is high enough that collisions are virtually impossible
  const trackId = generateTrackId();

  const reportRef = await addDoc(collection(db, 'reports'), {
    trackId,
    title:         data.title,
    description:   data.description,
    category:      data.category,
    severity:      data.severity || 'medium',
    status:        'pending',
    location:      data.location || '',
    incidentDate:  data.incidentDate || null,
    isAnonymous:   data.isAnonymous !== false,
    reporterEmail: data.reporterEmail || null,
    evidence:      [],
    assignedTo:    null,
    createdAt:     serverTimestamp(),
    updatedAt:     serverTimestamp(),
  });

  // Upload files if any
  if (files.length > 0) {
    const uploaded = [];
    for (let i = 0; i < files.length; i++) {
      const f = await uploadFile(files[i], reportRef.id, p => onProgress?.(i, files.length, p));
      uploaded.push(f);
    }
    await updateDoc(reportRef, { evidence: uploaded });
  }

  // Audit log
  await addDoc(collection(db, 'auditLog'), {
    action: 'REPORT_CREATED', entityType: 'report', entityId: reportRef.id,
    details: { trackId, category: data.category },
    createdAt: serverTimestamp(),
  });

  return { trackId, reportId: reportRef.id };
};

// ── TRACK REPORT (public) ─────────────────────────────────────
export const trackReport = async (trackId) => {
  const q = query(collection(db, 'reports'), where('trackId', '==', trackId.trim().toUpperCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
};

// ── GET ALL REPORTS (admin) ───────────────────────────────────
export const getReports = async (filters = {}) => {
  const constraints = [orderBy('createdAt', 'desc')];
  if (filters.status && filters.status !== 'all')
    constraints.unshift(where('status', '==', filters.status));
  if (filters.severity && filters.severity !== 'all')
    constraints.unshift(where('severity', '==', filters.severity));
  const snap = await getDocs(query(collection(db, 'reports'), ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ── GET SINGLE REPORT ─────────────────────────────────────────
export const getReport = async (id) => {
  try {
    const snap = await getDoc(doc(db, 'reports', id));
    if (!snap.exists()) return null;

    // Fetch comments WITHOUT orderBy to avoid needing a composite index.
    // Sort client-side instead.
    let comments = [];
    try {
      const commentsSnap = await getDocs(
        query(collection(db, 'comments'), where('reportId', '==', id))
      );
      comments = commentsSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return ta - tb;
        });
    } catch (e) {
      console.warn('Could not fetch comments:', e.message);
      comments = [];
    }

    return { id: snap.id, ...snap.data(), comments };
  } catch (err) {
    console.error('getReport error:', err);
    throw err;
  }
};

// ── UPDATE STATUS ─────────────────────────────────────────────
export const updateReportStatus = async (id, status, updatedBy) => {
  await updateDoc(doc(db, 'reports', id), { status, updatedAt: serverTimestamp() });
  await addDoc(collection(db, 'auditLog'), {
    action: 'STATUS_CHANGED', entityType: 'report', entityId: id,
    details: { newStatus: status }, updatedBy, createdAt: serverTimestamp(),
  });
};

// ── ASSIGN REPORT ─────────────────────────────────────────────
export const assignReport = async (id, assignedTo) => {
  await updateDoc(doc(db, 'reports', id), { assignedTo, updatedAt: serverTimestamp() });
};

// ── ADD COMMENT ───────────────────────────────────────────────
export const addComment = async (reportId, userId, userName, message, isInternal = false) => {
  return addDoc(collection(db, 'comments'), {
    reportId, userId, userName, message, isInternal, createdAt: serverTimestamp(),
  });
};

// ── DASHBOARD STATS ───────────────────────────────────────────
export const getDashboardStats = async () => {
  const snap = await getDocs(collection(db, 'reports'));
  const reports = snap.docs.map(d => d.data());
  const byStatus = {}, bySeverity = {}, byCategory = {};
  reports.forEach(r => {
    byStatus[r.status]     = (byStatus[r.status]     || 0) + 1;
    bySeverity[r.severity] = (bySeverity[r.severity] || 0) + 1;
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
  });
  return { total: reports.length, byStatus, bySeverity, byCategory, reports };
};

// ── REAL-TIME LISTENER ────────────────────────────────────────
export const subscribeToReports = (callback) => {
  const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(200));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};
