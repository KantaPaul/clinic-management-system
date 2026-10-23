import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { UserPlus, AlertCircle } from 'lucide-react';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose }) => {
  const { addPatient, language } = useClinic();

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [phone, setPhone] = useState('017');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown'>('B+');
  const [address, setAddress] = useState('');
  const [allergies, setAllergies] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addPatient({
      name,
      nameBn: nameBn.trim() || undefined,
      age: Number(age),
      gender,
      phone,
      address: address.trim() || 'Dhaka',
      bloodGroup,
      allergies: allergies
        ? allergies.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      chronicConditions: [],
      emergencyContact: {
        name: emergencyName.trim() || 'Guardian',
        relationship: 'Family',
        phone: emergencyPhone.trim() || phone,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {language === 'bn' ? 'নতুন রোগী নিবন্ধন' : 'Register New Patient'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'ডিজিটাল মেডিকেল রেকর্ডের জন্য রোগীর মৌলিক তথ্য' : 'Demographics, contact info, blood group & allergy registry'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Full Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Anisur Rahman"
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                রোগীর নাম (বাংলায়)
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={e => setNameBn(e.target.value)}
                placeholder="যেমন: আনিসুর রহমান"
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Age (Years) *</label>
              <input
                type="number"
                min="0"
                max="120"
                required
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Gender *</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value as any)}
                className="w-full text-xs font-bold text-rose-700 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Mobile Phone *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 01711223344"
                className="w-full text-xs font-mono font-bold border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Address / Area
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. Dhanmondi, Dhaka"
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Known Drug Allergies (Comma separated)
            </label>
            <input
              type="text"
              value={allergies}
              onChange={e => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Sulfa, Aspirin"
              className="w-full text-xs border border-rose-300 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none bg-rose-50/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={e => setEmergencyName(e.target.value)}
                placeholder="e.g. Salma (Spouse)"
                className="w-full text-xs border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Emergency Phone
              </label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                placeholder="e.g. 01819998877"
                className="w-full text-xs border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 shadow-md shadow-cyan-600/20"
            >
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
