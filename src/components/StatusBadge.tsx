import { Badge } from './ui/Badge';
import type { Customer, OrderStatus } from '../types';

const customerTone: Record<Customer['status'], 'success' | 'neutral' | 'brand'> = {
  active: 'success',
  inactive: 'neutral',
  lead: 'brand',
};

export function CustomerStatusBadge({ status }: { status: Customer['status'] }) {
  return (
    <Badge tone={customerTone[status]} dot className="capitalize">
      {status}
    </Badge>
  );
}

const orderTone: Record<OrderStatus, 'warning' | 'info' | 'brand' | 'success' | 'danger'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'brand',
  delivered: 'success',
  cancelled: 'danger',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge tone={orderTone[status]} dot className="capitalize">
      {status}
    </Badge>
  );
}
