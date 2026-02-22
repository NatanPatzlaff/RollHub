# RollHub Design System

## Color Palette

### Backgrounds
- **Primary Background**: `bg-zinc-900` (used for cards, main containers)
- **Secondary Background**: `bg-zinc-800` (used for sections, hover states)
- **Tertiary Background**: `bg-zinc-950` (used for nested containers, inputs)
- **Muted Background**: `bg-zinc-950/50` (used for explanatory text, secondary sections)

### Text Colors
- **Primary Text**: `text-white` (titles, important text)
- **Secondary Text**: `text-zinc-300` (main body text)
- **Tertiary Text**: `text-zinc-400` (labels, less important)
- **Muted Text**: `text-zinc-500` (hints, disabled state)
- **Strongly Muted**: `text-zinc-600` (very low importance)

### Accent Colors
- **Primary Accent**: `blue-400` / `blue-500` (main call-to-action, HeroUI primary)
- **Secondary Accent**: `purple-400` / `purple-500` (secondary actions, veteran status)
- **Success/Positive**: `emerald-400` / `emerald-500` (confirmation, positive values)
- **Warning/Attention**: `amber-400` / `amber-500` / `orange-500` (warnings, energy)
- **Error/Negative**: `red-400` / `red-500` (errors, damage, negative values)
- **Information**: `indigo-400` / `indigo-500` (neutral info, bonuses)

## Components

### Cards
```jsx
<Card className="bg-zinc-900 border border-zinc-800 shadow-none">
  <CardHeader className="pb-2 border-b border-zinc-800/50">
    <div className="text-lg font-bold text-zinc-100">Title</div>
  </CardHeader>
  <CardBody>
    {/* content */}
  </CardBody>
</Card>
```

### Buttons

#### Bordered Button (Default action)
```jsx
<Button 
  variant="bordered" 
  className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"
>
  Action
</Button>
```

#### Flat Button (Secondary action)
```jsx
<Button 
  variant="flat" 
  className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
>
  Action
</Button>
```

#### Primary Button (Important action)
```jsx
<Button color="primary" className="font-bold">
  Primary Action
</Button>
```

### Status Chips
```jsx
// Success
<Chip className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
  Positive
</Chip>

// Error
<Chip className="bg-red-500/10 text-red-400 border-red-500/20">
  Error
</Chip>

// Neutral
<Chip className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
  Info
</Chip>

// Secondary
<Chip className="bg-purple-500/10 text-purple-400 border-purple-500/20">
  Secondary
</Chip>
```

### Info Messages
```jsx
<div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-md">
  <span className="text-blue-400">Important information</span>
</div>
```

### Input Fields
```jsx
<input 
  className="bg-zinc-950 border border-zinc-800 rounded-md py-2 px-3 text-white focus:border-zinc-700"
/>

<select className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
  <option>Option</option>
</select>
```

### Progress Bars
```jsx
<Progress
  value={percent}
  classNames={{
    indicator: "bg-gradient-to-r from-red-500 to-rose-500",
    track: "bg-zinc-950 border border-zinc-800"
  }}
/>
```

### Dropdowns
```jsx
<Dropdown>
  <DropdownTrigger>
    <Button variant="bordered" className="border-zinc-700 text-zinc-400">
      Menu
    </Button>
  </DropdownTrigger>
  <DropdownMenu className="bg-zinc-900 border border-zinc-800 text-zinc-300">
    <DropdownItem>Option</DropdownItem>
  </DropdownMenu>
</Dropdown>
```

### Stat Display Cards
```jsx
<div className="flex-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800 group cursor-help transition-colors hover:border-zinc-700">
  <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">
    Label
  </div>
  <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
    Value
  </div>
</div>
```

## Typography

### Headings
- **H1**: `text-lg font-bold text-zinc-100`
- **H2**: `text-sm font-bold text-zinc-200`
- **H3**: `text-xs font-bold text-zinc-300`

### Labels
- **Small Label**: `text-xs text-zinc-500 uppercase font-bold tracking-widest`
- **Muted Label**: `text-[10px] text-zinc-600 uppercase font-bold`

## Spacing

- **Card Padding**: `p-4` / `p-6`
- **Element Gaps**: `gap-2` / `gap-3` / `gap-4`
- **Vertical Spacing**: `space-y-2` / `space-y-3` / `space-y-4` / `space-y-6`
- **List Spacing**: `space-y-2`

## Borders & Shadows

- **Card Border**: `border border-zinc-800`
- **Interactive Border**: `border-zinc-700` (hover state)
- **Divider**: `<Divider className="bg-zinc-800" />`
- **Shadow**: `shadow-none` (flat design)

## Transitions

- **Standard Transition**: `transition-colors` / `transition-all`
- **Duration**: `duration-300`
- **Combined**: `transition-all duration-300`

## Icon Styling

- **Icon Size**: 14-18px (common: `size={14}`, `size={18}`)
- **Icon Container**: `bg-zinc-950 text-zinc-400` with conditional color classes
- **Icon Hover**: `hover:text-white transition-colors`

## Special Patterns

### Weight/Load Indicator
```jsx
<div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800">
  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
</div>
```

### Attribute Value (with special color for 0)
```jsx
<span className={`text-xs w-5 text-center font-mono ${attr.val === 0 ? 'text-emerald-400' : ''}`}>
  {attr.val}
</span>
```

### Status Label
```jsx
<div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-wider">
  <IconComponent size={12} />
  Status Text
</div>
```

## Color Usage by Element

| Element | Color | Usage |
|---------|-------|-------|
| Card Background | `zinc-900` | Primary containers |
| Card Border | `zinc-800` | Card boundaries |
| Interactive Border | `zinc-700` | Buttons, inputs |
| Main Text | `white` | Titles, important |
| Secondary Text | `zinc-300` | Body text |
| Tertiary Text | `zinc-400` | Labels |
| Muted Text | `zinc-500` | Hints |
| Primary Action | `blue-400/500` | Main buttons (HeroUI primary) |
| Secondary Action | `purple-400/500` | Alternative actions |
| Success | `emerald-400/500` | Positive states, confirmations |
| Warning | `amber/orange-400/500` | Warnings, energy, danger |
| Error | `red-400/500` | Errors, damage |
| Info | `indigo-400/500` | Neutral information |
| Status Good | `emerald-400` | Good conditions |
| Status Bad | `purple-400` | Veteran/special status |

## Implementation Notes

1. **Consistency**: All cards should use `bg-zinc-900 border border-zinc-800 shadow-none`
2. **Hover States**: Buttons should transition between `text-zinc-400` and `text-white`, borders between `border-zinc-700` and `border-zinc-600`
3. **Accessibility**: Always use sufficient contrast - avoid text below `text-zinc-500` for primary content
4. **Responsive**: Use responsive breakpoints consistently (`md:`, `lg:`, etc.)
5. **Animations**: Prefer `transition-colors duration-300` for subtle effects
6. **Icons**: Use Lucide React with 14-18px sizes, apply color classes on the icon itself

## Recent Implementations

### Character Sheet (show.tsx)
- Fully implements design system
- Best reference for all UI patterns
- Demonstrates card hierarchy, stat displays, progress bars, interactive elements

### Home Page (home.tsx)
- Origin selection with search
- Card expansion with backdrop
- Implements scrollbar customization with blue gradient

### Login Page (login.tsx)
- Basic implementation
- Needs full design system application
- Has autofill CSS override
