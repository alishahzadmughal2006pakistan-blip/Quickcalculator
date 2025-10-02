import TipCalculator from '@/components/tip-calculator';
import BmiCalculator from '@/components/bmi-calculator';
import PercentageCalculator from '@/components/percentage-calculator';
import AgeCalculator from '@/components/age-calculator';
import UnitConverter from '@/components/unit-converter';
import LoanCalculator from '@/components/loan-calculator';
import CurrencyConverter from '@/components/currency-converter';
import ScientificCalculator from '@/components/scientific-calculator';
import TaxCalculator from '@/components/tax-calculator';
import InvestmentReturnCalculator from '@/components/investment-return-calculator';
import DateCalculator from '@/components/date-calculator';
import DiscountCalculator from '@/components/discount-calculator';
import DataStorageConverter from '@/components/data-storage-converter';
import BasicCalculator from '@/components/calculator';
import type { ComponentType } from 'react';

export const allCalculators: { key: string, component: ComponentType<any>, title: string, category: string }[] = [
  { key: 'home', component: BasicCalculator, title: "Basic Calculator", category: 'free' },
  { key: 'tip', component: TipCalculator, title: "Tip Calculator", category: 'free' },
  { key: 'bmi', component: BmiCalculator, title: "BMI Calculator", category: 'free' },
  { key: 'percentage', component: PercentageCalculator, title: "Percentage Calculator", category: 'free' },
  { key: 'age', component: AgeCalculator, title: "Age Calculator", category: 'free' },
  { key: 'unit', component: UnitConverter, title: "Unit Converter", category: 'tools' },
  { key: 'loan', component: LoanCalculator, title: "Loan/EMI Calculator", category: 'advanced' },
  { key: 'currency', component: CurrencyConverter, title: "Currency Converter", category: 'advanced' },
  { key: 'scientific', component: ScientificCalculator, title: "Scientific Calculator", category: 'advanced' },
  { key: 'tax', component: TaxCalculator, title: "Tax Calculator", category: 'advanced' },
  { key: 'investment', component: InvestmentReturnCalculator, title: "Investment Calculator", category: 'advanced' },
  { key: 'date', component: DateCalculator, title: "Date Calculator", category: 'tools' },
  { key: 'discount', component: DiscountCalculator, title: "Discount Calculator", category: 'free' },
  { key: 'data', component: DataStorageConverter, title: "Data Storage Converter", category: 'tools' },
];
