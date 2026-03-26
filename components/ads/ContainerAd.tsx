import { useEffect, useRef } from 'react';

interface ContainerAdProps {
  scriptSrc: string;
  containerId: string;
  className?: string;
}

export default function ContainerAd({ scriptSrc, containerId, className = '' }: ContainerAdProps) {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    if (document.getElementById(`script-${containerId}`)) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.id = `script-${containerId}`;
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = scriptSrc;
    document.body.appendChild(script);

    return () => {
      const el = document.getElementById(`script-${containerId}`);
      if (el) el.remove();
    };
  }, [scriptSrc, containerId]);

  return (
    <div
      id={containerId}
      className={`flex justify-center overflow-hidden ${className}`}
      style={{ maxWidth: '100%' }}
    />
  );
}
