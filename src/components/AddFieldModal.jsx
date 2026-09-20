import React, { useState } from 'react';
import { X, Sprout, Plus } from 'lucide-react';

export const AddFieldModal = ({ isOpen, onClose, onAddField }) => {
  const [name, setName] = useState('');
  const [crop, setCrop] = useState('Soybean');
  const [acres, setAcres] = useState('1.5');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newField = {
      id: `field-${Date.now()}`,
      name: name || `Field #${Math.floor(Math.random() * 100)} – ${crop}`,
      crop: `${crop} (Kharif Season)`,
      acres: parseFloat(acres) || 1.0,
      status: 'Healthy',
      imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      lastScanned: 'Just registered',
      soilMoisture: 60,
      healthScore: 98,
    };
    onAddField(newField);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#0F382A] font-bold">
              <Sprout className="w-5 h-5 text-[#0F382A]" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900 leading-tight">
                Add New Field Parcel
              </h3>
              <p className="text-xs text-stone-500">
                Register crop plot for AI monitoring
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Field Label / Identifier:
            </label>
            <input
              type="text"
              placeholder="e.g. West Plot – Soybean"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-900 focus:outline-emerald-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Crop Variety:
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-900 focus:outline-emerald-600"
              >
                <option value="Tomato">Tomato</option>
                <option value="Cotton">Cotton</option>
                <option value="Wheat">Wheat</option>
                <option value="Soybean">Soybean</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Grapes">Grapes</option>
                <option value="Pomegranate">Pomegranate</option>
                <option value="Onion">Onion</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Area (Acres):
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="100"
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-900 focus:outline-emerald-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Irrigation Type:
            </label>
            <select className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-900 focus:outline-emerald-600">
              <option>Drip Irrigation (Automated)</option>
              <option>Sprinkler Irrigation</option>
              <option>Flood / Furrow Irrigation</option>
              <option>Rainfed</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#0F382A] hover:bg-[#164E3A] text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
