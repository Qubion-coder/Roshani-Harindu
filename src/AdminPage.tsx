import React, { useState } from 'react';
import { Copy, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const [prefix, setPrefix] = useState('');
  const [guestName, setGuestName] = useState('');
  
  const [generated, setGenerated] = useState<{
    url: string;
    message: string;
  } | null>(null);
  const [copiedType, setCopiedType] = useState<'link' | 'message' | null>(null);

  const generateDisplayName = (pfx: string, name: string) => {
    const trimmed = name.trim();
    if (!pfx) return trimmed;
    if (pfx === 'Family') return `${trimmed} and Family`;
    if (pfx === 'Dear') return trimmed;
    return `${pfx} ${trimmed}`;
  };

  const generateMessage = (pfx: string, name: string, url: string) => {
    const displayName = generateDisplayName(pfx, name);
    return `Dear ${displayName} ❤️\n\nWith joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.\n\nPlease view our wedding invitation and all the event details through the link below 🌐:\n\n${url}\n\nYour presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.\n\nWith love,\n❤️ Roshani & Harindu`;
  };

  const handleGenerate = () => {
    if (!guestName.trim()) return;
    const trimmed = guestName.trim();
    const displayName = generateDisplayName(prefix, trimmed);
    const url = `${window.location.origin}/${encodeURIComponent(displayName)}`;
    const message = generateMessage(prefix, trimmed, url);
    setGenerated({ url, message });
  };

  const copyToClipboard = (text: string, type: 'link' | 'message') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-xl border border-[#F0E6D2] p-8 md:p-10 mb-8">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-[#F7E7CE] rounded-full flex items-center justify-center mb-4 shadow-inner">
            <LinkIcon className="text-[#D4AF37] w-6 h-6" />
          </div>
          <h1 className="serif text-3xl md:text-4xl text-[#1A1A1A] tracking-widest uppercase font-bold text-center">Link Generator</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[12px] uppercase tracking-[0.2em] font-bold text-[#D4AF37] mb-2">Select Prefix</label>
            <select 
              value={prefix} 
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full p-4 border border-zinc-200 rounded-xl bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-serif text-[#1A1A1A] text-xl"
            >
              <option value="">No Prefix</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Miss">Miss</option>
              <option value="Mr. & Mrs.">Mr. & Mrs.</option>
              <option value="Family">Family</option>
              <option value="Dear">Dear</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] uppercase tracking-[0.2em] font-bold text-[#D4AF37] mb-2">Guest Name</label>
            <input 
              type="text" 
              placeholder="e.g. Sanjaya" 
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full p-4 border border-zinc-200 rounded-xl bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-serif text-[#1A1A1A] text-xl"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={!guestName.trim()}
            className="w-full py-4 bg-[#D4AF37] text-white rounded-xl uppercase tracking-widest font-bold text-base hover:bg-[#b09780] transition-colors disabled:opacity-50 shadow-md cursor-pointer"
          >
            Generate Links
          </button>
        </div>
      </div>

      {generated && (
        <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-xl border border-[#F0E6D2] p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h2 className="serif text-2xl text-[#1A1A1A] uppercase tracking-widest font-bold mb-4 text-center">Invitation Message</h2>
            <div className="bg-[#FFFFFF] p-6 rounded-xl border border-zinc-200 mb-6 font-serif text-[#1A1A1A] whitespace-pre-wrap text-[15px] leading-relaxed">
              {generated.message}
            </div>

            <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 mb-6 flex items-center justify-between overflow-hidden">
              <span className="text-zinc-600 text-sm truncate font-medium">{generated.url}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={() => copyToClipboard(generated.url, 'link')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-xl transition-colors text-sm uppercase tracking-wider font-bold cursor-pointer ${copiedType === 'link' ? 'bg-green-100 text-green-600' : 'bg-[#FFFFFF] text-[#D4AF37] border border-[#F0E6D2] hover:bg-[#F0E6D2]'}`}
              >
                {copiedType === 'link' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                Copy Link Only
              </button>
              <button 
                onClick={() => copyToClipboard(generated.message, 'message')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-xl transition-colors text-sm uppercase tracking-wider font-bold cursor-pointer ${copiedType === 'message' ? 'bg-green-100 text-green-600' : 'bg-[#D4AF37] text-white hover:bg-[#b09780] shadow-md'}`}
              >
                {copiedType === 'message' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                Copy Full Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
