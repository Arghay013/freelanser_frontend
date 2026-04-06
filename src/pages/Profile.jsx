import { useAuth } from "../state/auth";
import Card from "../ui/Card";
import { Mail, Shield, User, BadgeCheck, Sparkles } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Card>
          <div className="text-base-content/70">You are not logged in. Please login first.</div>
        </Card>
      </div>
    );
  }

  const initial = (user.username || "U").slice(0, 1).toUpperCase();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-base-200 bg-base-100 shadow-xl">
        <div className="relative">
          <div className="h-36 bg-gradient-to-r from-primary/90 via-secondary/70 to-accent/80" />
          <div className="px-6 pb-7 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border-4 border-base-100 bg-base-100 text-3xl font-black text-primary shadow-xl">
                  {initial}
                </div>
                <div className="pb-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-base-content/70">
                    <Sparkles size={13} />
                    Account overview
                  </div>
                  <h1 className="mt-3 text-3xl font-black text-base-content">{user.username}</h1>
                  <p className="mt-1 text-base-content/65">Manage your account information and role details here.</p>
                </div>
              </div>

              <div className="badge badge-primary badge-lg rounded-full border-none px-4 py-4 font-semibold">
                {user.role}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="md:col-span-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <User size={20} />
          </div>
          <div className="mt-4 text-sm font-semibold uppercase tracking-wide text-base-content/55">Username</div>
          <div className="mt-2 text-2xl font-black text-base-content break-all">{user.username}</div>
          <p className="mt-2 text-sm text-base-content/65">This is the name shown across your dashboard and order activity.</p>
        </Card>

        <Card className="md:col-span-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <Shield size={20} />
          </div>
          <div className="mt-4 text-sm font-semibold uppercase tracking-wide text-base-content/55">Role</div>
          <div className="mt-2">
            <span className="badge badge-outline rounded-full px-4 py-3 font-semibold">{user.role}</span>
          </div>
          <p className="mt-3 text-sm text-base-content/65">Your role controls which dashboard and actions you can access.</p>
        </Card>

        <Card className="md:col-span-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <BadgeCheck size={20} />
          </div>
          <div className="mt-4 text-sm font-semibold uppercase tracking-wide text-base-content/55">Status</div>
          <div className="mt-2 text-2xl font-black text-base-content">Active</div>
          <p className="mt-2 text-sm text-base-content/65">Your account is ready to use with the current role-based flow.</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-base-200 text-base-content">
            <Mail size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-base-content">Contact information</h2>
            <p className="text-sm text-base-content/65">Primary email address attached to this account.</p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-base-200 bg-base-200/70 p-5">
          <div className="text-sm font-semibold uppercase tracking-wide text-base-content/55">Email</div>
          <div className="mt-2 break-all text-lg font-bold text-base-content">{user.email || "—"}</div>
        </div>
      </Card>
    </div>
  );
}