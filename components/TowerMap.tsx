import React, { useState, useMemo } from 'react';
import {
    Users, Scale, Globe, Feather, Library, GraduationCap,
    Landmark, Hammer, Lock, ChevronDown, ChevronUp, MapPin, Map
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
        icon: <Hammer className="w-5 h-5" />,
        description: '禁地，银条制造车间',
        accessLevel: 'classified', requiredGrade: 4
    },
    {
        level: 7, name: '教授办公室', englishName: 'Faculty Offices',
        icon: <Landmark className="w-5 h-5" />,
        description: '教授与高级研究员',
        accessLevel: 'restricted', requiredGrade: 2
    },
    {
        level: 6, name: '教室', englishName: 'Instruction Rooms',
        icon: <GraduationCap className="w-5 h-5" />,
        description: '从基础拉丁语到翻译理论',
        accessLevel: 'member', requiredGrade: 1
    },
    {
        level: 5, name: '参考资料室', englishName: 'Reference Materials',
        icon: <Library className="w-5 h-5" />,
        description: '学术宝库，世界语言词典',
        accessLevel: 'member', requiredGrade: 1
    },
    {
        level: 4, name: '文学系', englishName: 'Literature Department',
        icon: <Feather className="w-5 h-5" />,
        description: '翻译与比较文学',
        accessLevel: 'member', requiredGrade: 1
    },
    {
        level: 3, name: '口译部', englishName: 'Interpretation Dept',
        icon: <Globe className="w-5 h-5" />,
        description: '外交口译培训',
        accessLevel: 'member', requiredGrade: 3
    },
    {
        level: 2, name: '法务部', englishName: 'Legal Department',
        icon: <Scale className="w-5 h-5" />,
        description: '条约与法律翻译',
        accessLevel: 'member', requiredGrade: 1
    },
    {
        level: 1, name: '大堂', englishName: 'The Lobby',
        icon: <Users className="w-5 h-5" />,
        description: '公众开放区域',
        accessLevel: 'public', requiredGrade: 0
    }
];

const ACCESS_CONFIG = {
    public: { label: '公开', color: 'bg-emerald-600' },
    member: { label: '学员', color: 'bg-blue-600' },
    restricted: { label: '受限', color: 'bg-amber-600' },
    classified: { label: '机密', color: 'bg-red-700' }
};

// ===== COMPONENTS =====

/** 塔楼楼层卡片 */
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
            className={`relative border-2 transition-all duration-300 overflow-hidden cursor-pointer
        ${isCurrent ? 'border-gold bg-gold/10 shadow-lg' : 'border-ink/20 bg-white/60'}
        ${isLocked ? 'opacity-50' : 'hover:border-ink/40'}
      `}
            onClick={() => !isLocked && onToggle()}
        >
            {/* Floor Number Badge */}
            <div className="absolute top-0 left-0 bg-ink text-paper font-mono font-bold text-sm w-8 h-8 flex items-center justify-center">
                {floor.level}F
            </div>

            {/* Lock Overlay */}
            {isLocked && (
                <div className="absolute inset-0 bg-ink/10 flex items-center justify-center z-10">
                    <div className="bg-ink/80 text-paper px-2 py-1 rounded-sm text-xs font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> 需要 {floor.requiredGrade} 年级
                    </div>
                </div>
            )}

            {/* Current Location Indicator */}
            {isCurrent && (
                <div className="absolute top-1 right-1 bg-gold text-ink px-2 py-0.5 text-[10px] font-bold animate-pulse">
                    当前位置
                </div>
            )}

            {/* Floor Content */}
            <div className="pl-10 pr-3 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {floor.icon}
                        <div>
                            <div className="font-display font-bold text-sm">{floor.name}</div>
                            <div className="text-[10px] text-ink/50 italic">{floor.englishName}</div>
                        </div>
                    </div>
                    <span className={`text-[10px] text-white font-bold px-1.5 py-0.5 rounded ${accessConfig.color}`}>
                        {accessConfig.label}
                    </span>
                </div>
                {isExpanded && (
                    <p className="mt-2 text-xs text-ink/70 border-t border-ink/10 pt-2">
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
                {/* Player marker with sonar effect */}
                <div className="relative">
                    <div className="w-6 h-6 bg-crimson text-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div className="absolute inset-0 bg-crimson/30 rounded-full animate-ping" />
                </div>
                {/* Tooltip */}
                {showTooltip && label && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-ink text-xs px-2 py-1 rounded shadow-lg border border-ink/20 whitespace-nowrap z-50">
                        你：{label}
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
                <div className="flex flex-wrap justify-center gap-0.5" style={{ maxWidth: '56px' }}>
                    {characters.slice(0, 8).map((char, idx) => (
                        <div
                            key={char.name}
                            className="w-5 h-5 rounded-full border border-gold bg-paper overflow-hidden shadow-md"
                            style={{ zIndex: characters.length - idx }}
                        >
                            <img
                                src={char.url}
                                alt={char.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        </div>
                    ))}
                    {characters.length > 8 && (
                        <div className="w-5 h-5 rounded-full border border-gold bg-ink text-paper text-[8px] font-bold flex items-center justify-center">
                            +{characters.length - 8}
                        </div>
                    )}
                </div>
                {/* Tooltip */}
                {showTooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-ink text-xs px-2 py-1 rounded shadow-lg border border-ink/20 whitespace-nowrap z-50 max-w-[200px]">
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
    // Find player's location coordinates
    const playerLoc = useMemo(() => matchLocation(currentLocation), [currentLocation]);

    // Group characters by location
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
        <div className="relative w-full aspect-[4/3] bg-paper-contrast rounded border-2 border-ink/20 overflow-hidden">
            {/* Map Image */}
            <img
                src="https://i.ibb.co/SDpXxz9G/image.png"
                alt="Oxford Map"
                className="w-full h-full object-cover opacity-90"
            />

            {/* Map Overlay for better marker visibility */}
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
                <div className="absolute bottom-2 right-2 bg-ink/80 text-paper text-xs px-2 py-1 rounded">
                    位置未知: {currentLocation}
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-2 left-2 bg-paper/90 border border-ink/20 rounded px-2 py-1 text-[10px] flex gap-3">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-crimson rounded-full" /> 你的位置
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gold rounded-full border border-ink/30" /> NPC
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
    const [activeTab, setActiveTab] = useState<ViewTab>('tower');
    const [expandedFloor, setExpandedFloor] = useState<number | null>(null);

    return (
        <div className="w-full h-full overflow-y-auto bg-paper p-4">
            {/* Tab Navigation */}
            <div className="flex border-b-2 border-ink/20 mb-4">
                <button
                    onClick={() => setActiveTab('tower')}
                    className={`flex items-center gap-2 px-4 py-2 font-display font-bold text-sm transition-colors
            ${activeTab === 'tower' ? 'border-b-2 border-gold text-gold -mb-0.5' : 'text-ink/60 hover:text-ink'}`}
                >
                    <Landmark className="w-4 h-4" /> 巴别塔 / Tower
                </button>
                <button
                    onClick={() => setActiveTab('world')}
                    className={`flex items-center gap-2 px-4 py-2 font-display font-bold text-sm transition-colors
            ${activeTab === 'world' ? 'border-b-2 border-gold text-gold -mb-0.5' : 'text-ink/60 hover:text-ink'}`}
                >
                    <Map className="w-4 h-4" /> 牛津 / Oxford
                </button>
            </div>

            {/* Tower View */}
            {activeTab === 'tower' && (
                <div className="space-y-2">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h3 className="font-display text-xl">BABEL TOWER</h3>
                        <p className="text-xs text-ink/50">Royal Institute of Translation · 皇家翻译学院</p>
                    </div>

                    {/* Grade Info */}
                    <div className="flex justify-between text-xs px-2 py-1.5 bg-ink/5 rounded mb-3">
                        <span><strong>当前权限:</strong> {playerGrade} 年级</span>
                        <span><strong>可访问:</strong> {FLOORS.filter(f => playerGrade >= f.requiredGrade).length}/{FLOORS.length}</span>
                    </div>

                    {/* Floor Cards */}
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

                    {/* Legend */}
                    <div className="flex flex-wrap gap-2 justify-center mt-4 pt-3 border-t border-ink/20">
                        {Object.entries(ACCESS_CONFIG).map(([key, config]) => (
                            <div key={key} className="flex items-center gap-1 text-[10px]">
                                <div className={`w-2 h-2 rounded-full ${config.color}`} />
                                {config.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* World Map View */}
            {activeTab === 'world' && (
                <div className="space-y-3">
                    {/* Header */}
                    <div className="text-center mb-3">
                        <h3 className="font-display text-xl">OXFORD</h3>
                        <p className="text-xs text-ink/50">牛津城地图 · City Map</p>
                    </div>

                    {/* Current Location */}
                    <div className="text-xs px-2 py-1.5 bg-ink/5 rounded flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-crimson" />
                        <span><strong>当前位置:</strong> {currentLocation}</span>
                    </div>

                    {/* Map */}
                    <WorldMapView
                        currentLocation={currentLocation}
                        characterDynamics={characterDynamics}
                    />

                    {/* Characters Present */}
                    {Object.keys(characterDynamics).length > 0 && (
                        <div className="text-xs text-ink/60 pt-2 border-t border-ink/10">
                            <strong>追踪中的角色:</strong> {Object.keys(characterDynamics).join(', ')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TowerMap;
