
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'worldBook.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);

    // Helper to update entry
    const updateEntry = (id, keywords, constant = false) => {
        if (json.entries[id]) {
            json.entries[id].constant = constant;
            // Merge new keywords with existing ones
            const existingKeys = json.entries[id].key || [];
            const newKeys = [...new Set([...existingKeys, ...keywords])];
            json.entries[id].key = newKeys;
            console.log(`Updated Entry ${id}: constant=${constant}, keys=${newKeys.length}`);
        } else {
            console.warn(`Entry ${id} not found`);
        }
    };

    // 4: World View
    updateEntry('4', ['World', 'Empire', 'Babel', 'History', 'Setting', 'Background', '世界观', '帝国', '背景'], false);

    // 5: Magic (Already has keys, just ensure false)
    // key: ["刻银术","魔法","施法","银条","词对"]
    updateEntry('5', [], false);

    // 6: Campus Life
    // key: ["课程","校园","学院","实习"]
    updateEntry('6', ["文学系", "法务部", "口译部", "Literature", "Legal", "Interpretation", "Workshops", "Rotation", "Department"], false);

    // 7: Tower Layout
    // key: ["巴别塔","大堂","楼层","塔楼"]
    updateEntry('7', ["Floor", "Lobby", "Stairs", "Office", "Library", "Reference", "Classroom", "Silver-working", "楼层", "电梯", "办公室"], false);

    // 8: World Layout (Oxford/London)
    // key: ["牛津","伦敦","城市","酒馆","宿舍","公园","市场","工厂","码头"]
    updateEntry('8', ["Oxford", "London", "Nemesis", "City", "Town", "River", "Thames", "复仇女神号", "泰晤士河"], false);

    // 0: Init (Keep False? It's init vars usually constant true in ST but here it's false in original)
    // It seems 0 is 'initvar', 1 is 'rules'. 1 should be constant true.
    // 2 is 'variable list', constant true.
    // 3 is 'output format', constant true.
    // Original file had 0 as constant: false. I'll leave it.

    // Save back formatted
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log('Successfully updated worldBook.json');

} catch (err) {
    console.error('Error modifying JSON:', err);
}
