import React, { useRef } from 'react';
import { Clock, MapPin, CloudFog, User, Shirt, Coins, Upload } from 'lucide-react';
import { PlayerProfile } from '../types';

interface SidebarProps {
    profile: PlayerProfile;
    isMobileEmbedded?: boolean;
    onAvatarChange?: (avatar: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ profile, isMobileEmbedded = false, onAvatarChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onAvatarChange) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                onAvatarChange(base64);
                // Also save to localStorage for persistence
                localStorage.setItem('babelAcademy_avatar', base64);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <aside className={`
            bg-[#e6dac0] border-ink flex flex-col z-10 font-serif relative overflow-hidden select-none
            ${isMobileEmbedded ? 'w-full h-auto border-none shadow-none' : 'w-full lg:w-80 h-full border-r shadow-[10px_0_30px_-5px_rgba(0,0,0,0.4)]'}
        `}>
            {/* Paper texture overlay */}
            <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
            <div className="absolute inset-0 bg-paper-texture opacity-60 pointer-events-none mix-blend-multiply"></div>

            {/* Vertical Separator Line (Simulating column fold) - Only for desktop sidebar */}
            {!isMobileEmbedded && <div className="absolute right-1 top-0 bottom-0 w-[1px] bg-ink/10"></div>}

            {/* Scrollable Container */}
            <div className={`
                relative z-10 flex flex-col gap-6 hide-scrollbar
                ${isMobileEmbedded ? 'h-auto p-2' : 'flex-1 overflow-y-auto p-5'}
            `}>

                {/* Newspaper Header (Masthead) */}
                <header className="flex flex-col items-center border-b-4 border-double border-ink pb-4">
                    <div className="w-full flex justify-between items-end border-b border-ink mb-2 pb-1">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-ink/60">Est. 1842</span>
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-ink/60">London</span>
                    </div>
                    <h1 className="font-display text-4xl font-black text-ink tracking-tight uppercase leading-[0.9] text-center transform scale-y-110 mb-3 drop-shadow-sm">
                        The Babel<br /><span className="text-3xl">Daily</span>
                    </h1>
                    <div className="w-full flex justify-between items-center border-t border-b-2 border-ink py-1 px-1 text-[10px] font-mono font-bold uppercase tracking-wider text-ink">
                        <span>Vol. XCII</span>
                        <span className="flex-1 text-center">· 牛津特刊 ·</span>
                        <span>5 Coppers</span>
                    </div>
                </header>

                {/* Environmental / Dateline Section */}
                <section className="flex flex-col gap-0 border-b border-ink pb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-ink text-[#e6dac0] px-1 py-0.5 text-[10px] font-bold uppercase tracking-widest">LATEST</span>
                        <div className="h-[1px] flex-1 bg-ink"></div>
                    </div>

                    <div className="flex flex-row justify-between items-stretch">
                        <div className="flex-1 pr-2 border-r border-ink border-dashed flex flex-col justify-center">
                            <div className="flex items-center gap-1 text-crimson mb-1">
                                <Clock className="w-3 h-3" />
                                <span className="text-[10px] uppercase font-bold">Time</span>
                            </div>
                            <span className="font-mono text-xl font-bold text-ink">{profile.time}</span>
                        </div>
                        <div className="flex-1 pl-3 flex flex-col justify-center">
                            <div className="flex items-center gap-1 text-academy mb-1">
                                <MapPin className="w-3 h-3" />
                                <span className="text-[10px] uppercase font-bold">Location</span>
                            </div>
                            <span className="font-display font-bold text-sm leading-tight text-ink">{profile.location}</span>
                        </div>
                    </div>
                </section>

                {/* Weather "Clipping" */}
                <section className="bg-ink/5 border border-ink p-2 relative shadow-sm">
                    <div className="absolute -top-3 left-2 bg-[#e6dac0] px-2 text-ink">
                        <span className="text-[10px] font-bold uppercase tracking-widest border-b border-crimson">Weather Forecast</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 pt-1">
                        <CloudFog className="w-8 h-8 text-ink/70" />
                        <p className="font-body text-lg leading-6 italic text-ink/90">
                            <span className="font-bold not-italic text-sm uppercase mr-1">Report:</span>
                            {profile.weather}
                        </p>
                    </div>
                </section>

                {/* Main Feature: Player Profile */}
                <article className="flex-1 flex flex-col gap-4">
                    <div className="text-center relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ink"></div></div>
                        <h2 className="relative bg-[#e6dac0] px-4 font-display text-xl font-bold uppercase inline-block text-ink">
                            Personal File
                        </h2>
                    </div>

                    {/* Portrait with Caption and Upload Button */}
                    <figure className="flex flex-col gap-2 p-2 border border-ink bg-white/40 shadow-[4px_4px_0_0_rgba(26,26,26,0.2)] rotate-[-1deg] transition-transform hover:rotate-0">
                        <div className="aspect-square bg-ink/10 flex items-center justify-center border border-ink/20 overflow-hidden relative grayscale">
                            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="Student Portrait" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-24 h-24 text-ink/80 drop-shadow-lg" />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <figcaption className="text-center font-mono text-[10px] border-t border-ink/20 pt-1 text-ink/70 flex-1">
                                FIG A. 学员证件照 {profile.avatar ? '(已归档)' : '(未归档)'}
                            </figcaption>
                            {onAvatarChange && (
                                <>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-1 px-2 py-1 bg-ink text-[#e6dac0] text-[9px] font-bold uppercase tracking-wider hover:bg-ink/80 transition-colors rounded-sm"
                                    >
                                        <Upload className="w-3 h-3" />
                                        上传
                                    </button>
                                </>
                            )}
                        </div>
                    </figure>

                    {/* Details Text styled as Article */}
                    <div className="font-body text-lg text-justify leading-snug space-y-3 drop-cap-section text-ink/90">
                        <p>
                            <span className="float-left text-5xl font-display font-bold leading-[0.7] mt-1 mr-2 text-ink">你</span>
                            <span className="font-bold">{profile.name}</span>，现登记为<span className="italic border-b border-ink/50 border-dashed">{profile.grade}</span>。
                            据教务处记录，该生近期表现并不稳定，需加强观察。
                        </p>

                        <div className="grid grid-cols-1 gap-2 border-t-2 border-b-2 border-ink py-3 my-1">
                            <div className="flex items-start gap-2">
                                <Shirt className="w-4 h-4 mt-1 text-ink/60" />
                                <div className="flex flex-col">
                                    <span className="font-bold text-xs uppercase tracking-wider">Attire Description</span>
                                    <span className="text-sm italic text-ink/80 leading-tight">{profile.clothing}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-ink text-[#e6dac0] p-3 shadow-gothic relative mt-2 group">
                            <div className="absolute top-0 right-0 p-1">
                                <Coins className="w-4 h-4 text-gold animate-pulse" />
                            </div>
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-gold/80 mb-1">银币 Assets</span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-mono font-bold text-3xl text-gold">{profile.coins}</span>
                                <span className="font-display text-sm">¤</span>
                            </div>
                            <div className="w-full bg-gold/20 h-[1px] mt-2 group-hover:bg-gold/50 transition-colors"></div>
                        </div>
                    </div>
                </article>

                {/* Footer Ad */}
                <div className="mt-8 pt-4 border-t border-ink flex flex-col items-center opacity-70">
                    <span className="text-[9px] font-mono uppercase border border-ink px-1 rounded-sm mb-1">ADVERTISEMENT</span>
                    <p className="text-[10px] font-display uppercase tracking-widest text-center leading-relaxed">
                        <strong>巴别塔 · 皇家翻译学院</strong><br />
                        BABEL · OXFORD · BRITANIA
                    </p>
                </div>
            </div>
        </aside>
    );
};