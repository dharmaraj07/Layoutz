
import React from 'react';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { CheckCircle2, XCircle } from 'lucide-react';

const InvestmentComparisonTable = () => {
  return (
    <div className="overflow-x-auto w-full rounded-lg shadow-lg">
      <Table className="w-full">
        <TableCaption>Comparison of Plots vs. Other Investments</TableCaption>
        <TableHeader className="bg-housing-700">
          <TableRow>
            <TableHead className="text-white font-semibold">Parameters</TableHead>
            <TableHead className="text-white font-semibold text-center">Plots</TableHead>
            <TableHead className="text-white font-semibold text-center">Apartments</TableHead>
            <TableHead className="text-white font-semibold text-center">Independent Villas</TableHead>
            <TableHead className="text-white font-semibold text-center">Gold</TableHead>
            <TableHead className="text-white font-semibold text-center">Fixed Deposits</TableHead>
            <TableHead className="text-white font-semibold text-center">Mutual Funds</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            {
              parameter: "Returns (10 Years)",
              plots: "150% - 200%",
              apartments: "80% - 100%",
              villas: "100% - 120%",
              gold: "80% - 90%",
              fd: "60% - 65%",
              mutualFunds: "100% - 120%"
            },
            {
              parameter: "Capital Appreciation",
              plots: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />,
              apartments: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />,
              villas: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />,
              gold: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />,
              fd: <XCircle className="h-5 w-5 text-red-600 mx-auto" />,
              mutualFunds: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
            },
            {
              parameter: "Regular Income",
              plots: <XCircle className="h-5 w-5 text-red-600 mx-auto" />,
              apartments: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />,
              villas: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />,
              gold: <XCircle className="h-5 w-5 text-red-600 mx-auto" />,
              fd: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />,
              mutualFunds: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
            },
            {
              parameter: "Downside Risk",
              plots: "Very Low",
              apartments: "Medium",
              villas: "Medium",
              gold: "High",
              fd: "Very Low",
              mutualFunds: "High"
            },
            {
              parameter: "Volatility",
              plots: "Very Low",
              apartments: "Low",
              villas: "Low",
              gold: "High",
              fd: "Very Low",
              mutualFunds: "Very High"
            },
            {
              parameter: "Liquidity",
              plots: "Medium",
              apartments: "Low",
              villas: "Low",
              gold: "High",
              fd: "Medium",
              mutualFunds: "High"
            },
            {
              parameter: "Maintenance",
              plots: "Nil",
              apartments: "High",
              villas: "Very High",
              gold: "Nil",
              fd: "Nil",
              mutualFunds: "Nil"
            },
            {
              parameter: "Emotions Attached",
              plots: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />,
              apartments: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />,
              villas: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />,
              gold: <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />,
              fd: <XCircle className="h-5 w-5 text-red-600 mx-auto" />,
              mutualFunds: <XCircle className="h-5 w-5 text-red-600 mx-auto" />
            },
            {
              parameter: "Tax Benefits",
              plots: "Capital Gains",
              apartments: "Interest, Capital Gains",
              villas: "Interest, Capital Gains",
              gold: "Capital Gains",
              fd: "Nil",
              mutualFunds: "ELSS, Capital Gains"
            }
          ].map((row, index) => (
            <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <TableCell className="font-medium">{row.parameter}</TableCell>
              <TableCell className="text-center">{row.plots}</TableCell>
              <TableCell className="text-center">{row.apartments}</TableCell>
              <TableCell className="text-center">{row.villas}</TableCell>
              <TableCell className="text-center">{row.gold}</TableCell>
              <TableCell className="text-center">{row.fd}</TableCell>
              <TableCell className="text-center">{row.mutualFunds}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvestmentComparisonTable;
