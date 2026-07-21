const fs = require('fs');
const path = require('path');

const files = [
    'src/app/page.tsx',
    'src/components/home/FeaturedRoster.tsx'
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
    
    // Gradients & Shadows
    content = content.replace(/text-gold-gradient/g, 'text-gold');
    content = content.replace(/shadow-2xl/g, '');
    content = content.replace(/shadow-xl/g, '');
    content = content.replace(/drop-shadow-2xl/g, '');
    
    // Spacing (specific to page.tsx)
    if (filePath.includes('page.tsx')) {
        content = content.replace(/space-y-10/g, 'space-y-20');
        content = content.replace(/py-16 sm:py-24/g, 'py-24 sm:py-32');
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Refactored ${filePath}`);
});
