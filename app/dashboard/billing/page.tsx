"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Check, Zap, Building2, Globe, CreditCard, Download } from "lucide-react";
import { toast } from "sonner";

const PLANS = [
  {
    name: "Free", price: "$0", period: "forever", description: "Perfect to get started",
    features: ["5 projects", "3 boards per project", "Up to 5 members", "Basic analytics", "Community support"],
    cta: "Current Plan", current: true, color: "border-border",
  },
  {
    name: "Pro", price: "$12", period: "per member/mo", description: "For growing teams",
    features: ["Unlimited projects", "Unlimited boards", "Up to 50 members", "Advanced analytics", "Priority support", "Custom labels", "Board templates", "API access"],
    cta: "Upgrade to Pro", current: false, color: "border-primary", popular: true,
  },
  {
    name: "Business", price: "$28", period: "per member/mo", description: "For larger organizations",
    features: ["Everything in Pro", "Unlimited members", "Admin dashboard", "Audit logs", "SSO / SAML", "Custom roles", "Dedicated support", "SLA guarantee"],
    cta: "Upgrade to Business", current: false, color: "border-border",
  },
];

const INVOICES = [
  { id: "INV-001", date: "Jun 1, 2026", amount: "$0.00", status: "paid", plan: "Free" },
  { id: "INV-002", date: "May 1, 2026", amount: "$0.00", status: "paid", plan: "Free" },
  { id: "INV-003", date: "Apr 1, 2026", amount: "$0.00", status: "paid", plan: "Free" },
];

export default function BillingPage() {
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (planName: string) => {
    setUpgrading(planName);
    await new Promise(r => setTimeout(r, 1200));
    toast.success(`Upgrade to ${planName} initiated! You'll be redirected to checkout.`);
    setUpgrading(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Billing & Plans</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and payment details.</p>
      </div>

      {/* Current plan banner */}
      <Card className="mb-8 border-primary/30 bg-primary/5">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">You&apos;re on the Free plan</div>
              <div className="text-sm text-muted-foreground">Upgrade to unlock unlimited projects, boards, and advanced features.</div>
            </div>
          </div>
          <Button onClick={() => handleUpgrade("Pro")} className="gap-2 shrink-0">
            <Zap className="w-4 h-4" /> Upgrade to Pro
          </Button>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {PLANS.map(plan => (
          <Card key={plan.name} className={`relative ${plan.color} ${plan.popular ? "shadow-lg shadow-primary/10" : ""}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="text-xs px-3">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                {plan.name === "Free" && <Globe className="w-5 h-5 text-muted-foreground" />}
                {plan.name === "Pro" && <Zap className="w-5 h-5 text-primary" />}
                {plan.name === "Business" && <Building2 className="w-5 h-5 text-purple-400" />}
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                {plan.current && <Badge variant="secondary" className="text-xs">Current</Badge>}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/ {plan.period}</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.current ? "outline" : "default"}
                disabled={plan.current || upgrading === plan.name}
                onClick={() => !plan.current && handleUpgrade(plan.name)}
              >
                {upgrading === plan.name ? "Processing…" : plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment method */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><CreditCard className="w-4 h-4" /> Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No payment method on file. Add one when you upgrade.</div>
          <Button variant="outline" size="sm" className="mt-3 gap-2"><CreditCard className="w-3.5 h-3.5" /> Add Payment Method</Button>
        </CardContent>
      </Card>

      {/* Invoice history */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Download className="w-4 h-4" /> Invoice History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {INVOICES.map(inv => (
              <div key={inv.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors">
                <div>
                  <div className="text-sm font-medium">{inv.id}</div>
                  <div className="text-xs text-muted-foreground">{inv.date} · {inv.plan} plan</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{inv.amount}</span>
                  <Badge variant="secondary" className="text-xs capitalize">{inv.status}</Badge>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                    <Download className="w-3 h-3" /> PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
