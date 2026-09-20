import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, MapPin } from 'lucide-react';

const LAB_CENTERS = [
  {
    id: 'lab-1',
    name: 'District Soil & Crop Diagnostic Testing Center',
    address: 'Krishi Vigyan Kendra (KVK), Dindori Road, Nashik',
    phone: '+91 253 2530192',
    services: ['Fungal Culture Test', 'Pesticide Residue Analysis', 'Soil Micro-Nutrient Panel'],
    turnaround: '24-48 Hours',
    govtSubsidy: '100% Free under MahaKrishi Portal'
  },
  {
    id: 'lab-2',
    name: 'Regional Plant Health & Quarantine Lab',
    address: 'College of Agriculture Campus, Shivajinagar, Pune',
    phone: '+91 20 25537033',
    services: ['DNA PCR Virus Screen', 'Nematode Extraction', 'Bacterial Pathogen Test'],
    turnaround: '48 Hours',
    govtSubsidy: 'Government Certified'
  },
  {
    id: 'lab-3',
    name: 'ICAR National Research Centre Diagnostics',
    address: 'Manjri Farm Post, Solapur Road, Pune',
    phone: '+91 20 26956000',
    services: ['Grape & Pomegranate Advanced Pathology', 'Fungicide Resistance Assay'],
    turnaround: '24 Hours',
    govtSubsidy: 'ICAR Affiliated'
  }
];

export const LabReferralModal = ({ isOpen, onClose }) => {
  const [selectedLab, setSelectedLab] = useState(LAB_CENTERS[0]);
  const [sampleType, setSampleType] = useState('Leaf Foliage Lesion');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [tokenCode, setTokenCode] = useState('');

  if (!isOpen) return null;

  const handleBook = (e) => {
    e.preventDefault();
    setTokenCode(`MAHA-KRISHI-${Math.floor(100000 + Math.random() * 900000)}`);
    setBookingConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
              🔬
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900 leading-tight">
                Government Diagnostic Lab Referral
              </h3>
              <p className="text-xs text-stone-500">
                Department of Skills & Innovation · MahaKrishi Network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!bookingConfirmed ? (
            <form onSubmit={handleBook} className="space-y-4">
              
              {/* Select Accredited Lab */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
                  Select Certified Agricultural Lab:
                </label>
                <div className="space-y-2">
                  {LAB_CENTERS.map((lab) => (
                    <div
                      key={lab.id}
                      onClick={() => setSelectedLab(lab)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                        selectedLab.id === lab.id
                          ? 'border-[#0F382A] bg-emerald-50/50 ring-2 ring-[#0F382A]/20'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-stone-900 text-sm">{lab.name}</h4>
                          <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {lab.address}
                          </p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          {lab.govtSubsidy}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-stone-500">
                        <span>Turnaround: <strong className="text-stone-800">{lab.turnaround}</strong></span>
                        <span>•</span>
                        <span>Phone: <strong className="text-stone-800">{lab.phone}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Type Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                  Diagnostic Sample Category:
                </label>
                <select
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-800 focus:outline-emerald-600"
                >
                  <option value="Leaf Foliage Lesion">Leaf Foliage (Fungal/Bacterial Spot Diagnosis)</option>
                  <option value="Stem & Root System">Stem & Root System (Wilt & Nematode Screen)</option>
                  <option value="Soil Sample Profile">Soil Nutrient & Pathogen Biomass Testing</option>
                  <option value="Insect Trap Specimen">Pheromone Trap Specimen Identification</option>
                </select>
              </div>

              {/* Farmer Contact Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Farmer Name</label>
                  <input
                    type="text"
                    defaultValue="Ramesh Patil"
                    readOnly
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Mobile No.</label>
                  <input
                    type="tel"
                    defaultValue="+91 98220 44129"
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-800"
                  />
                </div>
              </div>

              {/* Submit Referral Request */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#0F382A] hover:bg-[#164E3A] text-white font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer"
                >
                  Generate Free Government Referral Pass
                </button>
              </div>
            </form>
          ) : (
            /* Referral Pass Success Voucher */
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-display text-xl font-bold text-emerald-950">
                  Lab Referral Confirmed!
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Show this digital voucher at the Krishi Vigyan Kendra collection counter.
                </p>
              </div>

              {/* QR Voucher Card */}
              <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-xs max-w-xs mx-auto text-center">
                <div className="w-28 h-28 bg-stone-100 rounded-xl mx-auto flex items-center justify-center border border-stone-200">
                  <QrCode className="w-20 h-20 text-stone-800" />
                </div>
                <div className="mt-2 font-mono font-bold text-xs text-stone-900 tracking-wider">
                  {tokenCode}
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  Valid for next 7 days · {selectedLab.name}
                </p>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full border border-emerald-300 bg-white text-emerald-900 text-xs font-semibold hover:bg-emerald-50 transition cursor-pointer"
                >
                  Print Voucher
                </button>
                <button
                  onClick={() => { setBookingConfirmed(false); onClose(); }}
                  className="px-5 py-2 rounded-full bg-[#0F382A] text-white text-xs font-semibold hover:bg-[#164E3A] transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
