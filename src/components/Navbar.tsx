import { useState, useEffect } from "react";
import { Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const Navbar = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/analyze", label: "Analyze" },
    { to: "/history", label: "History" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 glass-surface"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="h-8 w-8 rounded-lg gradient-clinical flex items-center justify-center"
          >
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </motion.div>
          <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">SkinScan.io</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link to={link.to}>
                <Button
                  variant={location.pathname === link.to ? "secondary" : "ghost"}
                  size="sm"
                >
                  {link.label}
                </Button>
              </Link>
            </motion.div>
          ))}
          {user ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="ml-1 gap-1"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="ml-1 gap-1">
                  <User className="h-4 w-4" /> Sign In
                </Button>
              </Link>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDark(!dark)}
              className="ml-2"
            >
              <motion.div
                key={dark ? "sun" : "moon"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.div>
            </Button>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;
