import { useMemo, useState, useRef, useEffect } from 'react';
import { Search, Trash2, ShoppingCart, ChevronLeft, ChevronRight, ChevronDown, X, Check } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { OrderStatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { generateOrders } from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/format';
import { toast } from '../components/Toast';
import { cn } from '../utils/cn';
import type { Order, OrderStatus } from '../types';

const ALL_ORDERS = generateOrders(48);
const PAGE_SIZE = 8;
const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(ALL_ORDERS);
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesSearch =
        !q ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        String(o.id).includes(q);
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, debounced, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalRevenue = filtered.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);

  const updateStatus = (id: number, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setOpenMenuId(null);
    toast.success(`Order #${id} marked as ${status}.`);
  };

  const confirmDelete = () => {
    if (!deleteOrder) return;
    setOrders((prev) => prev.filter((o) => o.id !== deleteOrder.id));
    toast.success(`Order #${deleteOrder.id} deleted.`);
    setDeleteOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Orders</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{filtered.length} orders · {formatCurrency(totalRevenue)} active revenue</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input placeholder="Search by order ID, customer, or product…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} aria-label="Search orders" />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (<option key={s} value={s} className="capitalize">{s}</option>))}
          </Select>
        </div>
      </Card>

      <Card>
        <CardContent className="p-0">
          {paged.length === 0 ? (
            <EmptyState icon={ShoppingCart} title="No orders found" description="Try a different search term or status filter." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">Product</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="hidden px-5 py-3 font-medium sm:table-cell">Date</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paged.map((o) => (
                    <tr key={o.id} className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-900 dark:text-slate-100">#{o.id}</p>
                        <p className="truncate text-xs text-slate-400">{o.customerName}</p>
                      </td>
                      <td className="hidden px-5 py-3 md:table-cell">
                        <p className="text-slate-700 dark:text-slate-200">{o.productName}</p>
                        <p className="text-xs text-slate-400">Qty {o.quantity} × {formatCurrency(o.price)}</p>
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(o.total)}</td>
                      <td className="px-5 py-3">
                        <div ref={openMenuId === o.id ? menuRef : undefined} className="inline-block">
                          <StatusDropdown status={o.status} open={openMenuId === o.id} onToggle={() => setOpenMenuId((cur) => (cur === o.id ? null : o.id))} onSelect={(s) => updateStatus(o.id, s)} />
                        </div>
                      </td>
                      <td className="hidden px-5 py-3 text-slate-500 sm:table-cell">{formatDate(o.date)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setDeleteOrder(o)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10" aria-label={`Delete order ${o.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
              <p className="text-xs text-slate-500">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft className="h-4 w-4" /> Prev</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next <ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal open={!!deleteOrder} onClose={() => setDeleteOrder(null)} title="Delete this order?" description="This action cannot be undone.">
        <div className="space-y-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
            <p className="text-sm text-red-700 dark:text-red-300">You're about to delete order <span className="font-semibold">#{deleteOrder?.id}</span> for {formatCurrency(deleteOrder?.total ?? 0)}.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteOrder(null)} leftIcon={<X className="h-4 w-4" />}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete} leftIcon={<Trash2 className="h-4 w-4" />}>Delete order</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatusDropdown({ status, open, onToggle, onSelect }: { status: OrderStatus; open: boolean; onToggle: () => void; onSelect: (s: OrderStatus) => void; }) {
  return (
    <div className="relative inline-block">
      <button onClick={onToggle} className={cn('inline-flex items-center gap-1.5 rounded-full py-0.5 pl-2.5 pr-1.5 text-xs font-medium ring-1 ring-inset transition-all', 'hover:ring-2 hover:ring-brand-500/40', open && 'ring-2 ring-brand-500/40')} aria-haspopup="listbox" aria-expanded={open}>
        <OrderStatusBadge status={status} />
        <ChevronDown className={cn('h-3.5 w-3.5 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div role="listbox" className="absolute left-0 top-full z-20 mt-1.5 w-40 animate-scale-in overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-elevated dark:border-slate-800 dark:bg-slate-900">
          {STATUS_OPTIONS.map((s) => (
            <button key={s} role="option" aria-selected={s === status} onClick={() => onSelect(s)} className={cn('flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium capitalize transition-colors', s === status ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800')}>
              {s}
              {s === status && <Check className="h-3.5 w-3.5 text-brand-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
