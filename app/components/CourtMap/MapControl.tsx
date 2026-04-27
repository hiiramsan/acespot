import { Plus, Minus, Locate } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Control = {
  id: string;
  Icon: LucideIcon;
  action: () => void;
  small?: boolean;
};

type Props = {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
};

export function MapControls({ zoomIn, zoomOut, reset }: Props) {
  const controls: Control[] = [
    { id: 'zoom-in', Icon: Plus, action: zoomIn },
    { id: 'zoom-out', Icon: Minus, action: zoomOut },
    { id: 'reset', Icon: Locate, action: reset },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: 50,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {controls.map(({ id, Icon, action, small }) => (
        <button
          key={id}
          onClick={action}
          aria-label={id}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#374151',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <Icon size={small ? 18 : 24} />
        </button>
      ))}
    </div>
  );
}