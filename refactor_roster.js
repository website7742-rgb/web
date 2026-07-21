const fs = require('fs');

const files = [
    'src/app/roster/page.tsx',
    'src/app/roster/[slug]/page.tsx'
];

files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Radii
    content = content.replace(/rounded-3xl/g, 'rounded-none');
    content = content.replace(/rounded-2xl/g, 'rounded-none');
    content = content.replace(/rounded-xl/g, 'rounded-none');
    
    // Borders
    content = content.replace(/border-white\/10/g, 'border-zinc-800');
    
    // Glass Panels
    content = content.replace(/glass-panel-gold/g, 'bg-black border border-gold');
    content = content.replace(/glass-panel/g, 'bg-black border border-zinc-800');
    content = content.replace(/glass-card-editorial/g, 'bg-black border border-zinc-800');
    
    // Gradients & Shadows
    content = content.replace(/text-gold-gradient/g, 'text-gold');
    content = content.replace(/shadow-2xl/g, '');
    content = content.replace(/shadow-xl/g, '');
    content = content.replace(/drop-shadow-2xl/g, '');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Refactored ${filePath}`);
});
