/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  RefreshCw,
  Key,
  Save,
  BarChart3,
  Activity,
  AlertCircle,
  X,
  CheckCircle,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import PageShell from "../components/PageShell";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { fetchAdminStats } from "../api/admin";

const LOCAL_TOKEN_KEY = "admin_token";

export default function AdminDashboard() {
  const [adminToken, setAdminToken] = useState(
    () => localStorage.getItem(LOCAL_TOKEN_KEY) || ""
  );
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [range, setRange] = useState("month"); // "week" | "month"
  const [isAuthed, setIsAuthed] = useState(false); // ascundem cardul după login

  async function loadStats() {
    if (!adminToken) {
      setError("Set admin token first (same as in Admin Products).");
      setStats(null);
      setIsAuthed(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchAdminStats(adminToken);
      setStats(data);
      setIsAuthed(true); // token valid -> ascundem cardul
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load stats");
      setStats(null);
      setIsAuthed(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (adminToken) {
      loadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSaveToken() {
    if (!adminToken.trim()) {
      setError("Admin token cannot be empty");
      setIsAuthed(false);
      return;
    }
    localStorage.setItem(LOCAL_TOKEN_KEY, adminToken.trim());
    setError("");
    setIsAuthed(false);
    loadStats();
  }

  const summary = stats?.summary || {
    totalRevenue: 0,
    totalOrders: 0,
    totalItems: 0,
  };

  const daily = stats?.daily || [];
  const weekly = stats?.weekly || [];
  const monthly = stats?.monthly || [];

  const avgOrderValue =
    summary.totalOrders > 0
      ? (summary.totalRevenue / summary.totalOrders).toFixed(2)
      : 0;

  // range pentru primul chart
  let chartData = [];
  let chartTitle = "";
  let xKey = "date";

  if (range === "week") {
    chartData = weekly;
    chartTitle = "Last 7 days";
    xKey = "date";
  } else {
    chartData = daily;
    chartTitle = "Last 30 days";
    xKey = "date";
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            {label}
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
            {payload[0].value.toFixed(2)} RON
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Header with gradient */}
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 flex items-center gap-2">
                  Analytics Dashboard
                </h1>
                <p className="text-purple-100">
                  Live sales insights powered by Stripe
                </p>
              </div>
            </div>
            <motion.button
              type="button"
              onClick={loadStats}
              disabled={loading || !adminToken}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-purple-600 font-semibold hover:bg-purple-50 transition-all shadow-lg disabled:opacity-60"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Refresh Data"}
            </motion.button>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            className="flex items-start gap-3 rounded-2xl border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-5 py-4 shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800 dark:text-red-200">
                Error
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Admin token card – doar când NU e logat */}
        {!isAuthed && (
          <motion.div
            className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 border-2 border-slate-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Authentication
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr,auto] items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Admin Token
                </label>
                <input
                  type="password"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all"
                  placeholder="Enter your admin token..."
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Same token from{" "}
                  <code className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                    ADMIN_TOKEN
                  </code>{" "}
                  in your .env
                </p>
              </div>
              <motion.button
                type="button"
                onClick={handleSaveToken}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-bold hover:from-purple-700 hover:to-violet-700 transition-all shadow-lg"
              >
                <Save className="w-4 h-4" />
                Save & Load
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Total Revenue */}
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 shadow-xl"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-purple-200" />
              </div>
              <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide mb-1">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-white mb-1">
                {summary.totalRevenue.toFixed(2)} RON
              </p>
              <p className="text-xs text-purple-200">All time earnings</p>
            </div>
          </motion.div>

          {/* Total Orders */}
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 shadow-xl"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <CheckCircle className="w-5 h-5 text-blue-200" />
              </div>
              <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide mb-1">
                Orders
              </p>
              <p className="text-3xl font-bold text-white mb-1">
                {summary.totalOrders}
              </p>
              <p className="text-xs text-blue-200">Completed checkouts</p>
            </div>
          </motion.div>

          {/* Items Sold */}
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 shadow-xl"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-200" />
              </div>
              <p className="text-sm font-semibold text-emerald-100 uppercase tracking-wide mb-1">
                Items Sold
              </p>
              <p className="text-3xl font-bold text-white mb-1">
                {summary.totalItems}
              </p>
              <p className="text-xs text-emerald-200">Total quantities</p>
            </div>
          </motion.div>

          {/* Average Order Value */}
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-6 shadow-xl"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-amber-200" />
              </div>
              <p className="text-sm font-semibold text-amber-100 uppercase tracking-wide mb-1">
                Avg Order Value
              </p>
              <p className="text-3xl font-bold text-white mb-1">
                {avgOrderValue} RON
              </p>
              <p className="text-xs text-amber-200">Per transaction</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily / Weekly Revenue */}
          <motion.div
            className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Revenue over time
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {chartTitle}
                  </p>
                </div>
              </div>

              <div className="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setRange("week")}
                  className={`px-3 py-1 rounded-full font-medium ${
                    range === "week"
                      ? "bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-300 shadow-sm"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Week
                </button>
                <button
                  type="button"
                  onClick={() => setRange("month")}
                  className={`px-3 py-1 rounded-full font-medium ${
                    range === "month"
                      ? "bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-300 shadow-sm"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  30 days
                </button>
              </div>
            </div>

            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                  <Activity className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                  No sales data yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Chart will update when orders come in
                </p>
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#a855f7"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#a855f7"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey={xKey}
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      stroke="#9ca3af"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      stroke="#9ca3af"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#a855f7"
                      strokeWidth={3}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Monthly Revenue */}
          <motion.div
            className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Monthly Revenue
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last 12 months overview
                </p>
              </div>
            </div>

            {monthly.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                  <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                  No monthly data
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Monthly totals will appear here
                </p>
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      stroke="#9ca3af"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      stroke="#9ca3af"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="revenue"
                      fill="#6366f1"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </div>

        {/* Info Footer */}
        <motion.div
          className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex-shrink-0">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                Real-time Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All metrics are calculated from actual Stripe payment data.
                Charts will automatically reflect real orders as they come in.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
