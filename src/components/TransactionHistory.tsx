import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ArrowUpDown, Calendar, Filter, Search } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  market: string;
  direction: "buy" | "sell";
  entryPrice: number;
  confidence: number;
  result: "win" | "loss" | "pending";
  profit?: number;
  accuracy?: number;
}

interface TransactionHistoryProps {
  transactions?: Transaction[];
}

const TransactionHistory = ({
  transactions: propTransactions,
}: TransactionHistoryProps) => {
  // Default transactions if none provided
  const defaultTransactions: Transaction[] = [
    {
      id: "1",
      date: "2023-06-15 14:30",
      market: "OTC BTC/USD",
      direction: "buy",
      entryPrice: 42350.75,
      confidence: 87,
      result: "win",
      profit: 125.5,
      accuracy: 92,
    },
    {
      id: "2",
      date: "2023-06-15 13:45",
      market: "OTC ETH/USD",
      direction: "sell",
      entryPrice: 2250.3,
      confidence: 76,
      result: "loss",
      profit: -45.2,
      accuracy: 65,
    },
    {
      id: "3",
      date: "2023-06-15 12:15",
      market: "OTC XRP/USD",
      direction: "buy",
      entryPrice: 0.5432,
      confidence: 92,
      result: "win",
      profit: 78.35,
      accuracy: 89,
    },
    {
      id: "4",
      date: "2023-06-15 11:00",
      market: "OTC LTC/USD",
      direction: "sell",
      entryPrice: 82.45,
      confidence: 81,
      result: "win",
      profit: 62.1,
      accuracy: 84,
    },
    {
      id: "5",
      date: "2023-06-15 10:30",
      market: "OTC BNB/USD",
      direction: "buy",
      entryPrice: 320.75,
      confidence: 65,
      result: "pending",
      accuracy: 78,
    },
  ];

  const transactions = propTransactions || defaultTransactions;

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: "asc" | "desc";
  } | null>(null);
  const [filterMarket, setFilterMarket] = useState<string>("all");
  const [filterResult, setFilterResult] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Sort function
  const sortedTransactions = React.useMemo(() => {
    let sortableTransactions = [...transactions];
    if (sortConfig !== null) {
      sortableTransactions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTransactions;
  }, [transactions, sortConfig]);

  // Filter function
  const filteredTransactions = React.useMemo(() => {
    return sortedTransactions.filter((transaction) => {
      const marketMatch =
        filterMarket === "all" || transaction.market === filterMarket;
      const resultMatch =
        filterResult === "all" || transaction.result === filterResult;
      const searchMatch =
        searchTerm === "" ||
        transaction.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.date.toLowerCase().includes(searchTerm.toLowerCase());

      return marketMatch && resultMatch && searchMatch;
    });
  }, [sortedTransactions, filterMarket, filterResult, searchTerm]);

  // Request sort
  const requestSort = (key: keyof Transaction) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get unique markets for filter
  const markets = ["all", ...new Set(transactions.map((t) => t.market))];

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl font-bold">
            Transaction History
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[200px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterMarket} onValueChange={setFilterMarket}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Market" />
                </SelectTrigger>
                <SelectContent>
                  {markets.map((market) => (
                    <SelectItem key={market} value={market}>
                      {market === "all" ? "All Markets" : market}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select value={filterResult} onValueChange={setFilterResult}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="win">Wins</SelectItem>
                  <SelectItem value="loss">Losses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("date")}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Date & Time
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("market")}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Market
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("direction")}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Direction
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("entryPrice")}
                    className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                  >
                    Entry Price
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("confidence")}
                    className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                  >
                    Confidence
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("result")}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Result
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("profit")}
                    className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                  >
                    Profit/Loss
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("accuracy")}
                    className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                  >
                    Accuracy
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.date}
                    </TableCell>
                    <TableCell>{transaction.market}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.direction === "buy"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {transaction.direction.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${transaction.entryPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.confidence}%
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.result === "win"
                            ? "default"
                            : transaction.result === "loss"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {transaction.result === "win"
                          ? "WIN"
                          : transaction.result === "loss"
                            ? "LOSS"
                            : "PENDING"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.profit !== undefined ? (
                        <span
                          className={
                            transaction.profit >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {transaction.profit >= 0 ? "+" : ""}
                          {transaction.profit.toFixed(2)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.accuracy !== undefined
                        ? `${transaction.accuracy}%`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-gray-500"
                  >
                    No transactions found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
