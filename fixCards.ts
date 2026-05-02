import * as fs from 'fs';
import * as path from 'path';

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Fix Protocol Guide (What are these?)
content = content.replace(
  `className="mb-4 p-4 bg-primary-container border border-primary/20 rounded-full text-sm text-primary space-y-2 animate-in fade-in slide-in-from-top-2"`,
  `className="mb-4 p-4 bg-primary-container border border-primary/20 rounded-3xl text-sm text-on-primary-container space-y-2 animate-in fade-in slide-in-from-top-2"`
);
content = content.replace(
  `className="font-bold text-primary">Protocol Guide</h4>`,
  `className="font-bold text-on-primary-container">Protocol Guide</h4>`
);
content = content.replace(
  `className="space-y-1.5 list-disc list-inside text-primary/80"`,
  `className="space-y-1.5 list-disc list-inside text-on-primary-container/80"`
);
// Total Cost card
content = content.replace(
  `bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-5 flex justify-between items-center border border-surface-variant/60`,
  `bg-surface-container-highest rounded-3xl p-5 flex justify-between items-center border border-surface-variant/60`
);
// Transaction rows
content = content.replace(
  `bg-surface-container/50 hover:bg-surface-container rounded-full transition-colors border border-surface-container-highest/50`,
  `bg-surface-container/50 hover:bg-surface-container rounded-2xl transition-colors border border-surface-container-highest/50`
);
// Packages mapping
content = content.replace(
  /className=\{`flex items-center justify-between p-4 rounded-full border-2 cursor-pointer transition-all/g,
  `className={\`flex items-center justify-between p-4 rounded-3xl border-2 cursor-pointer transition-all`
);

// Payment method ecocash
content = content.replace(
  `className={\`p-4 rounded-full border-2 cursor-pointer transition-all text-center \${paymentMethod === 'ecocash' ? 'border-primary bg-primary-container' : 'border-surface-container-highest hover:border-surface-variant'}\`}`,
  `className={\`p-4 rounded-3xl border-2 cursor-pointer transition-all text-center \${paymentMethod === 'ecocash' ? 'border-primary bg-primary-container' : 'border-surface-container-highest hover:border-surface-variant'}\`}`
);
content = content.replace(
  `className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center text-primary mb-3 font-bold"`,
  `className="w-12 h-12 mx-auto rounded-full bg-primary-container flex items-center justify-center text-on-primary-container mb-3 font-bold"`
);
// Payment method innbucks
content = content.replace(
  `className={\`p-4 rounded-full border-2 cursor-pointer transition-all text-center \${paymentMethod === 'innbucks' ? 'border-primary bg-primary-container' : 'border-surface-container-highest hover:border-surface-variant'}\`}`,
  `className={\`p-4 rounded-3xl border-2 cursor-pointer transition-all text-center \${paymentMethod === 'innbucks' ? 'border-primary bg-primary-container' : 'border-surface-container-highest hover:border-surface-variant'}\`}`
);
content = content.replace(
  `className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-3"`,
  `className="w-12 h-12 mx-auto rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container mb-3"`
);

fs.writeFileSync('src/pages/Dashboard.tsx', content, 'utf8');
console.log('Fixed cards in Dashboard.tsx');
