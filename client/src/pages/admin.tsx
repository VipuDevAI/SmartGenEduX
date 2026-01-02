import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  LogIn, LogOut, Users, CreditCard, FileText, Settings, 
  CheckCircle, XCircle, Clock, Gift, Eye, Download,
  School, TrendingUp, AlertCircle, RefreshCw
} from "lucide-react";

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface DashboardStats {
  totalSchools: number;
  pendingSchools: number;
  approvedSchools: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  totalRevenue: number;
  totalPayments: number;
}

function AdminLogin({ onLogin }: { onLogin: (admin: Admin, token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        onLogin(data.admin, data.token);
        toast({ title: "Welcome back!", description: `Logged in as ${data.admin.name}` });
      } else {
        toast({ title: "Login failed", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to connect to server", variant: "destructive" });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-lightbg to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-blue-orange flex items-center justify-center mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-brand-text dark:text-white">Admin Login</h1>
          <p className="text-muted-foreground text-sm mt-2">SmartGenEduX Control Panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smartgenedux.com"
              required
              data-testid="input-admin-email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              data-testid="input-admin-password"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full gradient-blue-orange text-white"
            disabled={isLoading}
            data-testid="button-admin-login"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            Default credentials:<br />
            Email: admin@smartgenedux.com<br />
            Password: SmartGenEduX@2025
          </p>
        </div>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-brand-text dark:text-white">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
}

function AdminDashboard({ admin, token, onLogout }: { admin: Admin; token: string; onLogout: () => void }) {
  const { toast } = useToast();
  
  const headers = { Authorization: `Bearer ${token}` };
  
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard-stats", { headers });
      return res.json();
    },
  });
  
  const { data: schools = [], refetch: refetchSchools } = useQuery<any[]>({
    queryKey: ["/api/admin/schools"],
    queryFn: async () => {
      const res = await fetch("/api/admin/schools", { headers });
      return res.json();
    },
  });
  
  const { data: subscriptions = [], refetch: refetchSubscriptions } = useQuery<any[]>({
    queryKey: ["/api/admin/subscriptions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/subscriptions", { headers });
      return res.json();
    },
  });
  
  const { data: payments = [], refetch: refetchPayments } = useQuery<any[]>({
    queryKey: ["/api/admin/payments"],
    queryFn: async () => {
      const res = await fetch("/api/admin/payments", { headers });
      return res.json();
    },
  });
  
  const { data: auditLogs = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/audit-logs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/audit-logs", { headers });
      return res.json();
    },
  });

  const approveSchool = async (id: string) => {
    const res = await fetch(`/api/admin/schools/${id}/approve`, { method: "PATCH", headers });
    if (res.ok) {
      toast({ title: "School approved" });
      refetchSchools();
      refetchStats();
    }
  };

  const rejectSchool = async (id: string) => {
    const res = await fetch(`/api/admin/schools/${id}/reject`, { method: "PATCH", headers });
    if (res.ok) {
      toast({ title: "School rejected" });
      refetchSchools();
      refetchStats();
    }
  };

  const approveSubscription = async (id: string) => {
    const res = await fetch(`/api/admin/subscriptions/${id}/approve`, { method: "PATCH", headers });
    if (res.ok) {
      toast({ title: "Subscription approved - Access granted" });
      refetchSubscriptions();
      refetchStats();
    }
  };

  const grantTrial = async (id: string, months: number) => {
    const res = await fetch(`/api/admin/subscriptions/${id}/grant-trial`, { 
      method: "PATCH", 
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ months }),
    });
    if (res.ok) {
      toast({ title: `${months} month trial granted` });
      refetchSubscriptions();
      refetchStats();
    }
  };

  const revokeSubscription = async (id: string) => {
    const res = await fetch(`/api/admin/subscriptions/${id}/revoke`, { method: "PATCH", headers });
    if (res.ok) {
      toast({ title: "Subscription revoked - Access removed" });
      refetchSubscriptions();
      refetchStats();
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", headers });
    localStorage.removeItem("adminToken");
    onLogout();
  };

  const refreshAll = () => {
    refetchStats();
    refetchSchools();
    refetchSubscriptions();
    refetchPayments();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-lightbg to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-card shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-blue-orange flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-brand-text dark:text-white">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">{admin.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={refreshAll} data-testid="button-refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Schools" value={stats?.totalSchools || 0} icon={School} color="gradient-blue-orange" />
          <StatsCard title="Active Subscriptions" value={stats?.activeSubscriptions || 0} icon={CheckCircle} color="bg-brand-green" />
          <StatsCard title="Pending Approvals" value={stats?.pendingSubscriptions || 0} icon={Clock} color="bg-brand-orange" />
          <StatsCard title="Total Revenue" value={`₹${stats?.totalRevenue || 0}`} icon={TrendingUp} color="bg-brand-blue" />
        </div>

        <Tabs defaultValue="schools" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="schools" data-testid="tab-schools">Schools</TabsTrigger>
            <TabsTrigger value="subscriptions" data-testid="tab-subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="payments" data-testid="tab-payments">Payments</TabsTrigger>
            <TabsTrigger value="logs" data-testid="tab-logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="schools">
            <Card className="p-6">
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Registered Schools ({schools.length})
              </h2>
              {schools.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No schools registered yet</p>
              ) : (
                <div className="space-y-4">
                  {schools.map((school: any) => (
                    <div key={school.id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-brand-text dark:text-white">{school.name}</h3>
                          <Badge variant={school.status === "approved" ? "default" : school.status === "rejected" ? "destructive" : "secondary"}>
                            {school.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{school.email} | {school.phone}</p>
                        <p className="text-sm text-muted-foreground">{school.city}, {school.state}</p>
                        <p className="text-xs text-muted-foreground mt-1">Students: {school.studentCount} | Principal: {school.principalName}</p>
                        {school.gstNumber && <p className="text-xs text-muted-foreground">GST: {school.gstNumber}</p>}
                      </div>
                      {school.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => approveSchool(school.id)} data-testid={`button-approve-school-${school.id}`}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => rejectSchool(school.id)} data-testid={`button-reject-school-${school.id}`}>
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card className="p-6">
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscriptions ({subscriptions.length})
              </h2>
              {subscriptions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No subscriptions yet</p>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((sub: any) => (
                    <div key={sub.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-brand-text dark:text-white">{sub.productType}</h3>
                            <Badge variant={
                              sub.status === "active" ? "default" : 
                              sub.status === "trial" ? "secondary" : 
                              sub.status === "paid" ? "outline" : 
                              sub.status === "revoked" ? "destructive" : "secondary"
                            }>
                              {sub.status}
                            </Badge>
                            {sub.isTrialActive && <Badge variant="outline">Trial Active</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Students: {sub.studentCount} | ₹{sub.pricePerStudent}/student | Total: ₹{sub.totalAmount}
                          </p>
                          <p className="text-xs text-muted-foreground">Contract: {sub.contractYears} year(s)</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(sub.status === "pending" || sub.status === "paid") && (
                            <>
                              <Button size="sm" onClick={() => approveSubscription(sub.id)} data-testid={`button-approve-sub-${sub.id}`}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Grant Access
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => grantTrial(sub.id, 1)} data-testid={`button-trial-1-${sub.id}`}>
                                <Gift className="h-4 w-4 mr-1" />
                                1M Trial
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => grantTrial(sub.id, 3)} data-testid={`button-trial-3-${sub.id}`}>
                                3M Trial
                              </Button>
                            </>
                          )}
                          {(sub.status === "active" || sub.status === "trial") && (
                            <Button size="sm" variant="destructive" onClick={() => revokeSubscription(sub.id)} data-testid={`button-revoke-${sub.id}`}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Revoke
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="p-6">
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment History ({payments.length})
              </h2>
              {payments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No payments yet</p>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment: any) => (
                    <div key={payment.id} className="border rounded-lg p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-brand-text dark:text-white">₹{payment.amount / 100}</p>
                          <Badge variant={payment.status === "completed" ? "default" : payment.status === "failed" ? "destructive" : "secondary"}>
                            {payment.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Order: {payment.razorpayOrderId}</p>
                        {payment.paidAt && (
                          <p className="text-xs text-muted-foreground">Paid: {new Date(payment.paidAt).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="p-6">
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Audit Logs
              </h2>
              {auditLogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No activity logs yet</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {auditLogs.slice(0, 50).map((log: any) => (
                    <div key={log.id} className="border-b pb-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{log.action}</Badge>
                        <span className="text-muted-foreground">{log.entityType}</span>
                      </div>
                      <p className="text-muted-foreground text-xs">{log.details}</p>
                      <p className="text-muted-foreground text-xs">{new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function AdminPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      fetch("/api/admin/verify", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.admin) {
            setAdmin(data.admin);
            setToken(savedToken);
          }
        })
        .finally(() => setIsChecking(false));
    } else {
      setIsChecking(false);
    }
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!admin || !token) {
    return <AdminLogin onLogin={(a, t) => { setAdmin(a); setToken(t); }} />;
  }

  return <AdminDashboard admin={admin} token={token} onLogout={() => { setAdmin(null); setToken(null); }} />;
}
