import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export default function BackButton({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className={`gap-1.5 text-muted-foreground hover:text-foreground mb-4 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {t.common.back}
    </Button>
  );
}
