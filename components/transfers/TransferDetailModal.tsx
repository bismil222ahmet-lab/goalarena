import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, DollarSign, User, MapPin } from 'lucide-react';
import type { TransferItem } from '@/types/football';
import { cn } from '@/lib/utils';

interface Props {
  transfer: TransferItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  completed: { color: 'bg-primary/10 text-primary border-primary/20', label: 'Completed' },
  official: { color: 'bg-accent/20 text-accent-foreground border-accent/30', label: 'Official' },
  rumor: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', label: 'Rumour' },
};

export default function TransferDetailModal({ transfer, open, onOpenChange }: Props) {
  if (!transfer) return null;
  const config = statusConfig[transfer.status] || { color: 'bg-muted text-muted-foreground', label: transfer.status };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Transfer Details</DialogTitle>
        </DialogHeader>

        {/* Player Header */}
        <div className="flex items-center gap-4 py-4 border-b border-border">
          {transfer.player_image ? (
            <img src={transfer.player_image} alt={transfer.player_name} className="h-20 w-20 rounded-full object-cover border-2 border-border" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
              {transfer.player_name[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground">{transfer.player_name}</h3>
            <Badge variant="outline" className={cn('mt-1', config.color)}>{config.label}</Badge>
          </div>
        </div>

        {/* Transfer Flow */}
        <div className="py-4 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
              {transfer.from_club_logo ? (
                <img src={transfer.from_club_logo} alt={transfer.from_club} className="h-12 w-12 object-contain" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{transfer.from_club[0]}</div>
              )}
              <span className="text-sm font-medium text-center truncate w-full">{transfer.from_club}</span>
              <span className="text-[10px] text-muted-foreground">Previous Club</span>
            </div>

            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <ArrowRight className="h-6 w-6 text-primary" />
              <span className="text-xs font-bold text-primary">{transfer.fee || 'Undisclosed'}</span>
            </div>

            <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
              {transfer.to_club_logo ? (
                <img src={transfer.to_club_logo} alt={transfer.to_club} className="h-12 w-12 object-contain" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{transfer.to_club[0]}</div>
              )}
              <span className="text-sm font-medium text-center truncate w-full">{transfer.to_club}</span>
              <span className="text-[10px] text-muted-foreground">New Club</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 py-4">
          <DetailRow icon={DollarSign} label="Transfer Fee" value={transfer.fee || 'Undisclosed'} />
          <DetailRow icon={User} label="Status" value={config.label} />
          <DetailRow icon={Calendar} label="Date" value={new Date(transfer.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} />
          <DetailRow icon={MapPin} label="From" value={transfer.from_club} />
          <DetailRow icon={MapPin} label="To" value={transfer.to_club} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
