import { useEffect, useState, useCallback } from 'react';
import { Search, ArrowUpDown, Users as UsersIcon, Mail, Phone, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/Avatar';
import { CustomerStatusBadge } from '../components/StatusBadge';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { fetchCustomers } from '../services/customerService';
import { formatNumber } from '../utils/format';
import type { Customer } from '../types';

const PAGE_SIZE = 8;

export default function Customers() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCustomers({ page, limit: PAGE_SIZE, search: debouncedSearch, sortBy, sortOrder });
      let users = res.users;
      if (statusFilter !== 'all') {
        users = users.filter((u) => u.status === statusFilter);
      }
      setData(users);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, sortBy, sortOrder, statusFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const toggleSort = () => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Customers</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{formatNumber(total)} customers in your workspace</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} aria-label="Search customers" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="lead">Lead</option>
            </Select>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort by field">
              <option value="firstName">First name</option>
              <option value="lastName">Last name</option>
              <option value="age">Age</option>
            </Select>
            <Button variant="outline" size="icon" onClick={toggleSort} aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}>
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardContent className="p-0">
          {error ? (
            <ErrorState message={error} onRetry={load} />
          ) : loading ? (
            <TableSkeleton />
          ) : data.length === 0 ? (
            <EmptyState icon={UsersIcon} title="No customers found" description="Try adjusting your search or filters to find what you're looking for." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">Contact</th>
                    <th className="hidden px-5 py-3 font-medium lg:table-cell">Company</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="hidden px-5 py-3 font-medium sm:table-cell">Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.map((c) => (
                    <tr key={c.id} className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={c.image} first={c.firstName} last={c.lastName} size="md" />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900 dark:text-slate-100">{c.firstName} {c.lastName}</p>
                            <p className="truncate text-xs text-slate-400">@{c.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-5 py-3 md:table-cell">
                        <div className="space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                          <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {c.email}</p>
                          <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {c.phone}</p>
                        </div>
                      </td>
                      <td className="hidden px-5 py-3 lg:table-cell">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" /> {c.company}
                        </span>
                      </td>
                      <td className="px-5 py-3"><CustomerStatusBadge status={c.status} /></td>
                      <td className="hidden px-5 py-3 text-slate-500 sm:table-cell">{c.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
              <p className="text-xs text-slate-500">Page <span className="font-semibold text-slate-700 dark:text-slate-300">{page}</span> of {totalPages}</p>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-3.5">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
