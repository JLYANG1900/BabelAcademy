import React, { useState, useMemo } from 'react';
import {
    Users, Scale, Globe, Feather, Library, GraduationCap,
    Landmark, Hammer, Lock, MapPin, Map
} from 'lucide-react';
import { CharacterDynamicData } from '../types';
import { WORLD_LOCATIONS, CHARACTER_AVATARS, matchLocation } from '../utils/mapCoordinates';

// ===== TYPES =====
interface FloorData {
    level: number;
    name: string;
    englishName: string;
    icon: React.ReactNode;
    description: string;
    accessLevel: 'public' | 'member' | 'restricted' | 'classified';
    requiredGrade: number;
}

interface TowerMapProps {
    currentLocation?: string;
    playerGrade?: number;
    characterDynamics?: Record<string, CharacterDynamicData>;
}

type ViewTab = 'tower' | 'world';

// ===== CONSTANTS =====
const FLOORS: FloorData[] = [
    {
        level: 8, name: '刻银部', englishName: 'Silver-working',
        icon: <Hammer className="w-4 h-4" />,
        description: '禁地，银条制造车间',
        accessLevel: 'classified', requiredGrade: 4
    },
    {
        level: 7, name: '教授办公室', englishName: 'Faculty Offices',
        icon: <Landmark className="w-4 h-4" />,
        description: '教授与高级研究员',
        accessLevel: 'restricted', requiredGrade: 2
    },
    {
        level: 6, name: '教室', englishName: 'Instruction Rooms',
        icon: <GraduationCap className="w-4 h-4" />,
        description: '从基础拉丁语到翻译理论',
        accessLevel: 'member', requiredGrade: 1
    },
    {
        level: 5, name: '参考资料室', englishName: 'Reference Materials',
        icon: <Library className="w-4 h-4" />,
        description: '学术宝库，世界语言词典',
        accessLevel: 'member', requiredGrade: 1
    },
    {
        level: 4, name: '文学系', englishName: 'Literature Department',
        icon: <Feather className="w-4 h-4" />,
        description: '翻译与比较文学',
        accessLevel: 'member', requiredGrade: 1
    },
    {
        level: 3, name: '口译部', englishName: 'Interpretation Dept',
        icon: <Globe className="w-4 h-4" />,
        description: '外交口译培训',
        accessLevel: 'member', requiredGrade: 3
    },
    {
        level: 2, name: '法务部', englishName: 'Legal Department',
        icon: <Scale className="w-4 h-4" />,
        description: '条约与法律翻译',
        accessLevel: 'member', requiredGrade: 1
    },
    {
        level: 1, name: '大堂', englishName: 'The Lobby',
        icon: <Users className="w-4 h-4" />,
        description: '公众开放区域',
        accessLevel: 'public', requiredGrade: 0
    }
];

const ACCESS_CONFIG = {
    public: { label: 'PUBLIC', color: 'bg-ink text-paper' },
    member: { label: 'MEMBER', color: 'bg-ink/70 text-paper' },
    restricted: { label: 'RESTRICTED', color: 'bg-crimson text-paper' },
    classified: { label: 'CLASSIFIED', color: 'bg-crimson text-paper' }
};

// ===== COMPONENTS =====

/** 塔楼楼层卡片 - 报纸风格 */
const FloorCard: React.FC<{
    floor: FloorData;
    isExpanded: boolean;
    isLocked: boolean;
    isCurrent: boolean;
    onToggle: () => void;
}> = ({ floor, isExpanded, isLocked, isCurrent, onToggle }) => {
    const accessConfig = ACCESS_CONFIG[floor.accessLevel];

    return (
        <div
            className={`relative border-2 border-ink transition-all duration-200 cursor-pointer
                ${isCurrent ? 'bg-paper-contrast shadow-newspaper' : 'bg-paper hover:bg-paper-contrast'}
                ${isLocked ? 'opacity-50' : ''}
            `}
            onClick={() => !isLocked && onToggle()}
        >
            {/* Floor Number Badge */}
            <div className="absolute top-0 left-0 bg-ink text-paper font-mono font-bold text-xs w-8 h-8 flex items-center justify-center border-r-2 border-b-2 border-ink">
                {floor.level}F
            </div>

            {/* Lock Overlay */}
            {isLocked && (
                <div className="absolute inset-0 bg-ink/5 flex items-center justify-center z-10">
                    <div className="bg-ink text-paper px-2 py-1 text-[10px] font-mono uppercase flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Grade {floor.requiredGrade} Required
                    </div>
                </div>
            )}

            {/* Current Location Indicator */}
            {isCurrent && (
                <div className="absolute top-1 right-1 bg-crimson text-paper px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider">
                    ● You Are Here
                </div>
            )}

            {/* Floor Content */}
            <div className="pl-10 pr-3 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-ink">{floor.icon}</span>
                        <div>
                            <div className="font-headline font-bold text-sm uppercase tracking-wide text-ink">{floor.name}</div>
                            <div className="text-[10px] text-ink/50 font-mono uppercase">{floor.englishName}</div>
                        </div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 ${accessConfig.color}`}>
                        {accessConfig.label}
                    </span>
                </div>
                {isExpanded && (
                    <p className="mt-2 text-xs text-ink/70 font-serif italic border-t border-ink/20 pt-2">
                        {floor.description}
                    </p>
                )}
            </div>
        </div>
    );
};

/** 地图位置标记 */
const MapMarker: React.FC<{
    x: number;
    y: number;
    isPlayer?: boolean;
    label?: string;
    characters?: { name: string; url: string }[];
}> = ({ x, y, isPlayer, label, characters = [] }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    if (isPlayer) {
        return (
            <div
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                style={{ left: `${x}%`, top: `${y}%` }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <div className="relative">
                    <div className="w-6 h-6 bg-crimson text-paper flex items-center justify-center shadow-newspaper animate-pulse">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div className="absolute inset-0 bg-crimson/30 animate-ping" />
                </div>
                {showTooltip && label && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ink text-paper text-[10px] font-mono px-2 py-1 border border-ink whitespace-nowrap z-50">
                        YOU: {label}
                    </div>
                )}
            </div>
        );
    }

    // NPC character markers
    if (characters.length > 0) {
        return (
            <div
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ left: `${x}%`, top: `${y}%` }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <div className="flex flex-wrap justify-center gap-1" style={{ maxWidth: '112px' }}>
                    {characters.slice(0, 8).map((char, idx) => (
                        <div
                            key={char.name}
                            className="w-10 h-10 border-2 border-ink bg-paper overflow-hidden shadow-newspaper"
                            style={{ zIndex: characters.length - idx }}
                        >
                            <img
                                src={char.url}
                                alt={char.name}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        </div>
                    ))}
                    {characters.length > 8 && (
                        <div className="w-10 h-10 border-2 border-ink bg-ink text-paper text-sm font-mono font-bold flex items-center justify-center">
                            +{characters.length - 8}
                        </div>
                    )}
                </div>
                {showTooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ink text-paper text-[10px] font-mono px-2 py-1 border border-ink whitespace-nowrap z-50 max-w-[200px]">
                        {characters.map(c => c.name).join(', ')}
                    </div>
                )}
            </div>
        );
    }

    return null;
};

/** 世界地图视图 */
const WorldMapView: React.FC<{
    currentLocation: string;
    characterDynamics: Record<string, CharacterDynamicData>;
}> = ({ currentLocation, characterDynamics }) => {
    const playerLoc = useMemo(() => matchLocation(currentLocation), [currentLocation]);

    const characterLocations = useMemo(() => {
        const locations: Record<string, { x: number; y: number; chars: { name: string; url: string }[] }> = {};

        Object.entries(characterDynamics).forEach(([charId, data]) => {
            if (!data.location) return;

            const avatar = CHARACTER_AVATARS[charId];
            if (!avatar) return;

            const loc = matchLocation(data.location);
            if (!loc) return;

            const key = `${loc.x},${loc.y}`;
            if (!locations[key]) {
                locations[key] = { x: loc.x, y: loc.y, chars: [] };
            }
            locations[key].chars.push({ name: charId, url: avatar.url });
        });

        return locations;
    }, [characterDynamics]);

    return (
        <div className="relative w-full aspect-[4/3] bg-paper-contrast border-3 border-ink overflow-hidden">
            {/* Map Image */}
            <img
                src="https://i.ibb.co/SDpXxz9G/image.png"
                alt="Oxford Map"
                className="w-full h-full object-cover grayscale contrast-110 opacity-90"
            />

            {/* Map Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/10" />

            {/* NPC Markers */}
            {Object.entries(characterLocations).map(([key, locData]) => (
                <MapMarker
                    key={key}
                    x={locData.x}
                    y={locData.y}
                    characters={locData.chars}
                />
            ))}

            {/* Player Marker */}
            {playerLoc ? (
                <MapMarker
                    x={playerLoc.x}
                    y={playerLoc.y}
                    isPlayer
                    label={currentLocation}
                />
            ) : (
                <div className="absolute bottom-2 right-2 bg-ink text-paper text-[10px] font-mono px-2 py-1">
                    Location Unknown: {currentLocation}
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-2 left-2 bg-paper/95 border-2 border-ink px-3 py-2 text-[10px] font-mono flex gap-4">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-crimson" /> YOUR POSITION
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-ink/70 border border-ink" /> NPC
                </div>
            </div>
        </div>
    );
};

// ===== MAIN COMPONENT =====
export const TowerMap: React.FC<TowerMapProps> = ({
    currentLocation = '教室',
    playerGrade = 1,
    characterDynamics = {}
}) => {
    const [activeTab, setActiveTab] = useState<ViewTab>('world');
    const [expandedFloor, setExpandedFloor] = useState<number | null>(null);

    return (
        <div className="w-full h-full overflow-y-auto bg-paper">
            {/* Newspaper Masthead */}
            <div className="text-center border-b-3 border-ink pb-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-ink"></div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/60">Cartography Dept.</span>
                    <div className="flex-1 h-px bg-ink"></div>
                </div>
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-ink uppercase tracking-wider">
                    Tower & City Maps
                </h1>
                <p className="text-sm font-serif italic text-ink/60 mt-2">
                    Official Survey of Babel Tower & Oxford · 巴别塔与牛津城地图
                </p>
            </div>

            {/* Tab Navigation - Newspaper section tabs */}
            <div className="flex border-b-2 border-ink mb-6">
                <button
                    onClick={() => setActiveTab('world')}
                    className={`flex items-center gap-2 px-6 py-3 font-headline font-bold text-sm uppercase tracking-wider transition-colors border-b-3 -mb-0.5
                        ${activeTab === 'world' ? 'border-ink text-ink bg-paper-contrast' : 'border-transparent text-ink/50 hover:text-ink'}`}
                >
                    <Map className="w-4 h-4" /> Oxford City
                </button>
                <button
                    onClick={() => setActiveTab('tower')}
                    className={`flex items-center gap-2 px-6 py-3 font-headline font-bold text-sm uppercase tracking-wider transition-colors border-b-3 -mb-0.5
                        ${activeTab === 'tower' ? 'border-ink text-ink bg-paper-contrast' : 'border-transparent text-ink/50 hover:text-ink'}`}
                >
                    <Landmark className="w-4 h-4" /> Babel Tower
                </button>
            </div>

            {/* Tower View */}
            {activeTab === 'tower' && (
                <div className="space-y-3">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 border-t border-ink"></div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-ink/60">Floor Directory</span>
                        <div className="flex-1 border-t border-ink"></div>
                    </div>

                    {/* Grade Info */}
                    <div className="flex justify-between text-xs px-3 py-2 bg-ink text-paper font-mono uppercase mb-4">
                        <span>Your Access Level: Grade {playerGrade}</span>
                        <span>Accessible: {FLOORS.filter(f => playerGrade >= f.requiredGrade).length}/{FLOORS.length} Floors</span>
                    </div>

                    {/* Floor Cards */}
                    <div className="space-y-2">
                        {FLOORS.map(floor => {
                            const isLocked = playerGrade < floor.requiredGrade;
                            const isCurrent = currentLocation.includes(floor.name) || currentLocation.includes(floor.englishName);
                            return (
                                <FloorCard
                                    key={floor.level}
                                    floor={floor}
                                    isExpanded={expandedFloor === floor.level}
                                    isLocked={isLocked}
                                    isCurrent={isCurrent}
                                    onToggle={() => setExpandedFloor(expandedFloor === floor.level ? null : floor.level)}
                                />
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 justify-center mt-6 pt-4 border-t-2 border-ink">
                        {Object.entries(ACCESS_CONFIG).map(([key, config]) => (
                            <div key={key} className="flex items-center gap-2 text-[10px] font-mono uppercase">
                                <div className={`w-4 h-4 ${config.color}`} />
                                {config.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* World Map View */}
            {activeTab === 'world' && (
                <div className="space-y-4">
                    {/* Current Location */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-ink text-paper">
                        <MapPin className="w-4 h-4 text-crimson" />
                        <span className="font-mono text-sm uppercase">Current Position:</span>
                        <span className="font-headline font-bold">{currentLocation}</span>
                    </div>

                    {/* Map */}
                    <WorldMapView
                        currentLocation={currentLocation}
                        characterDynamics={characterDynamics}
                    />

                    {/* Characters Present */}
                    {Object.keys(characterDynamics).length > 0 && (
                        <div className="text-xs font-mono text-ink/60 pt-3 border-t border-ink/20 uppercase">
                            <strong>Tracking:</strong> {Object.keys(characterDynamics).join(' · ')}
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="text-center text-ink/30 text-[10px] font-mono uppercase tracking-widest pt-6 mt-6 border-t border-ink/20">
                ❖ End of Survey ❖
            </div>
        </div>
    );
};

export default TowerMap;
