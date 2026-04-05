import { useEffect, useState } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, query, orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'

export function usePatients(uid) {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    const q = query(
      collection(db, 'users', uid, 'patients'),
      orderBy('criadoEm', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setPatients(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [uid])

  async function addPatient(uid, data) {
    await addDoc(collection(db, 'users', uid, 'patients'), {
      nome: data.nome,
      leito: data.leito || '',
      diagnostico: data.diagnostico || '',
      status: data.status || 'estavel',
      pendencias: [],
      evolucao: '',
      admissao: '',
      exames: [],
      notas: '',
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
    })
  }

  async function updatePatient(uid, patientId, data) {
    await updateDoc(doc(db, 'users', uid, 'patients', patientId), {
      ...data,
      atualizadoEm: serverTimestamp(),
    })
  }

  async function deletePatient(uid, patientId) {
    await deleteDoc(doc(db, 'users', uid, 'patients', patientId))
  }

  return { patients, loading, addPatient, updatePatient, deletePatient }
}
