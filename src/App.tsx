import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { QueueManager } from './components/queue/QueueManager';
import { ConsultationRoom } from './components/clinical/ConsultationRoom';
import { PatientList } from './components/patients/PatientList';
import { DoctorList } from './components/doctors/DoctorList';
import { BillingManager } from './components/billing/BillingManager';
import { ReportsView } from './components/reports/ReportsView';
import { AuditLogViewer } from './components/audit/AuditLogViewer';
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { WalkInSerialModal } from './components/modals/WalkInSerialModal';
import { SlotBookingModal } from './components/modals/SlotBookingModal';
import { AddPatientModal } from './components/modals/AddPatientModal';
import { CreateInvoiceModal } from './components/modals/CreateInvoiceModal';
import { PatientTeleconsultView } from './components/clinical/PatientTeleconsultView';

const MainLayout: React.FC = () => {
  const { activeTab } = useClinic();

  // Check for direct teleconsultation link (e.g. ?teleconsult=ROOM_ID)
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialTeleconsultRoom = urlParams ? urlParams.get('teleconsult') : null;
  const initialPatientName = urlParams ? urlParams.get('patientName') || 'Patient' : 'Patient';
  const [teleconsultRoom, setTeleconsultRoom] = useState<string | null>(initialTeleconsultRoom);

  // Modals state
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (teleconsultRoom) {
    return (
      <PatientTeleconsultView
        roomId={teleconsultRoom}
        patientName={initialPatientName}
        onExit={() => {
          // Remove query params cleanly
          window.history.replaceState({}, document.title, window.location.pathname);
          setTeleconsultRoom(null);
        }}
      />
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            onOpenPatientModal={() => setShowPatientModal(true)}
            onOpenSerialModal={() => setShowSerialModal(true)}
            onOpenSlotModal={() => setShowSlotModal(true)}
            onOpenInvoiceModal={() => setShowInvoiceModal(true)}
          />
        );
      case 'queue':
        return (
          <QueueManager
            onOpenSerialModal={() => setShowSerialModal(true)}
            onOpenSlotModal={() => setShowSlotModal(true)}
          />
        );
      case 'consultation':
        return <ConsultationRoom />;
      case 'patients':
        return <PatientList onOpenPatientModal={() => setShowPatientModal(true)} />;
      case 'doctors':
        return <DoctorList />;
      case 'billing':
        return <BillingManager onOpenInvoiceModal={() => setShowInvoiceModal(true)} />;
      case 'reports':
        return <ReportsView />;
      case 'audit':
        return <AuditLogViewer />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <Dashboard
            onOpenPatientModal={() => setShowPatientModal(true)}
            onOpenSerialModal={() => setShowSerialModal(true)}
            onOpenSlotModal={() => setShowSlotModal(true)}
            onOpenInvoiceModal={() => setShowInvoiceModal(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals */}
      <WalkInSerialModal
        isOpen={showSerialModal}
        onClose={() => setShowSerialModal(false)}
      />
      <SlotBookingModal
        isOpen={showSlotModal}
        onClose={() => setShowSlotModal(false)}
      />
      <AddPatientModal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
      />
      <CreateInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ClinicProvider>
      <MainLayout />
    </ClinicProvider>
  );
}
