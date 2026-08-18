const fs = require('fs');

const imports = `import { useState } from 'react'
import {
  FolderOpen,
  ClipboardList,
  Banknote,
  TrendingUp,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  ArrowRight,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
`;

let p = fs.readFileSync('src/pages/Projets/ProjetsPage.tsx', 'utf8');
p = p.replace("import { useState } from 'react'", "");
fs.writeFileSync('src/pages/Projets/ProjetsPage.tsx', imports + p);

let d = fs.readFileSync('src/pages/Dashboard/DashboardPage.tsx', 'utf8');
let dimports = `
import { 
  FolderOpen, 
  Users, 
  Banknote, 
  TrendingUp,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
`;
fs.writeFileSync('src/pages/Dashboard/DashboardPage.tsx', dimports + d);
