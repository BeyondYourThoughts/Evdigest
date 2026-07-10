import { useState } from 'react';
import {
  Calculator, Battery, Banknote, MapPin, Zap, Fuel, TrendingUp,
  ArrowRight, Car, CheckCircle2,
} from 'lucide-react';
import {
  Eyebrow, SectionHeading, Button, formatPrice, formatNumber,
} from '../components/ui/Primitives';

// ---------------------------------------------------------------------------
// Cost Savings Calculator
// ---------------------------------------------------------------------------
function CostSavingsCalculator() {
  const [dailyKms, setDailyKms] = useState(40);
  const [petrolPrice, setPetrolPrice] = useState(105);
  const [petrolMileage, setPetrolMileage] = useState(15);
  const [elecRate, setElecRate] = useState(8);
  const [evEfficiency, setEvEfficiency] = useState(6);

  const dailyKm = Math.max(0, dailyKms);
  const annualKm = dailyKm * 365;

  // Petrol cost per km
  const petrolPerKm = petrolMileage > 0 ? petrolPrice / petrolMileage : 0;
  const petrolDailyCost = petrolPerKm * dailyKm;
  const petrolAnnualCost = petrolDailyCost * 365;
  const petrol5yr = petrolAnnualCost * 5;

  // EV cost per km
  const evPerKm = evEfficiency > 0 ? elecRate / evEfficiency : 0;
  const evDailyCost = evPerKm * dailyKm;
  const evAnnualCost = evDailyCost * 365;
  const ev5yr = evAnnualCost * 5;

  const annualSavings = petrolAnnualCost - evAnnualCost;
  const savings5yr = petrol5yr - ev5yr;
  const savingsPct = petrol5yr > 0 ? (savings5yr / petrol5yr) * 100 : 0;

  const maxBar = Math.max(petrol5yr, ev5yr, 1);

  const inputCls =
    'w-full bg-canvas border border-hairline px-lg py-md font-sans-label text-body-sm text-ink focus:border-ink transition-colors';
  const labelCls =
    'font-sans-label text-caption uppercase tracking-[0.4px] text-body block mb-sm';

  return (
    <div className="bg-canvas border border-hairline p-3xl">
      <div className="flex items-center gap-sm mb-xl border-b border-ink pb-md">
        <Calculator className="w-[20px] h-[20px] text-ink" />
        <h3 className="font-display text-display-sm leading-[1.1] tracking-[-0.28px]">
          Cost Savings Calculator
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl">
        {/* Inputs */}
        <div className="space-y-lg">
          <div>
            <label className={labelCls}>Daily Distance (km)</label>
            <input
              type="number"
              min={0}
              value={dailyKms}
              onChange={(e) => setDailyKms(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Petrol Price (Rs / litre)</label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={petrolPrice}
              onChange={(e) => setPetrolPrice(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Petrol Vehicle Mileage (km / litre)</label>
            <input
              type="number"
              min={1}
              step={0.1}
              value={petrolMileage}
              onChange={(e) => setPetrolMileage(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Electricity Rate (Rs / kWh)</label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={elecRate}
              onChange={(e) => setElecRate(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>EV Efficiency (km / kWh)</label>
            <input
              type="number"
              min={1}
              step={0.1}
              value={evEfficiency}
              onChange={(e) => setEvEfficiency(Number(e.target.value))}
              className={inputCls}
            />
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="bg-canvas-soft p-xl mb-lg">
            <Eyebrow className="block mb-sm">5-Year Savings</Eyebrow>
            <p className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] text-ink">
              {formatPrice(Math.round(savings5yr))}
            </p>
            <p className="font-serif-body text-body-serif-md text-body mt-xs">
              {savingsPct.toFixed(0)}% cheaper than petrol over 5 years
            </p>
          </div>

          {/* Bar comparison */}
          <div className="space-y-lg">
            <div>
              <div className="flex items-center justify-between mb-xs">
                <span className="font-sans-label text-body-sm-strong text-body flex items-center gap-xs">
                  <Fuel className="w-[14px] h-[14px]" /> Petrol · 5 yr
                </span>
                <span className="font-sans-label text-body-sm-strong text-ink">
                  {formatPrice(Math.round(petrol5yr))}
                </span>
              </div>
              <div className="h-[24px] bg-canvas-soft border border-hairline">
                <div
                  className="h-full bg-body transition-all duration-300"
                  style={{ width: `${(petrol5yr / maxBar) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-xs">
                <span className="font-sans-label text-body-sm-strong text-body flex items-center gap-xs">
                  <Zap className="w-[14px] h-[14px]" /> EV · 5 yr
                </span>
                <span className="font-sans-label text-body-sm-strong text-ink">
                  {formatPrice(Math.round(ev5yr))}
                </span>
              </div>
              <div className="h-[24px] bg-canvas-soft border border-hairline">
                <div
                  className="h-full bg-ink transition-all duration-300"
                  style={{ width: `${(ev5yr / maxBar) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-md mt-xl pt-xl border-t border-hairline">
            <div>
              <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">Annual Fuel Cost</p>
              <p className="font-sans-label text-body-sm-strong text-ink">Petrol: {formatPrice(Math.round(petrolAnnualCost))}</p>
              <p className="font-sans-label text-body-sm-strong text-ink">EV: {formatPrice(Math.round(evAnnualCost))}</p>
            </div>
            <div>
              <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">Annual Savings</p>
              <p className="font-sans-label text-body-md-strong text-accent">
                {formatPrice(Math.round(annualSavings))}
              </p>
              <p className="font-sans-label text-caption text-body mt-xxs">
                {formatNumber(annualKm)} km / year
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Range Calculator
// ---------------------------------------------------------------------------
function RangeCalculator() {
  const [baseRange, setBaseRange] = useState(300);
  const [acImpact, setAcImpact] = useState(20);
  const [highwayPct, setHighwayPct] = useState(40);

  // AC usage reduces range (0% = no AC, 100% = max AC)
  const acFactor = 1 - (acImpact / 100) * 0.3; // max 30% reduction at 100%
  // Highway driving is less efficient — assume 15% more consumption at 100% highway
  const highwayFactor = 1 - (highwayPct / 100) * 0.15;

  const adjustedRange = Math.round(baseRange * acFactor * highwayFactor);
  const reductionPct = baseRange > 0 ? ((baseRange - adjustedRange) / baseRange) * 100 : 0;

  const inputCls =
    'w-full bg-canvas border border-hairline px-lg py-md font-sans-label text-body-sm text-ink focus:border-ink transition-colors';
  const labelCls =
    'font-sans-label text-caption uppercase tracking-[0.4px] text-body block mb-sm';

  return (
    <div className="bg-canvas border border-hairline p-3xl">
      <div className="flex items-center gap-sm mb-xl border-b border-ink pb-md">
        <Battery className="w-[20px] h-[20px] text-ink" />
        <h3 className="font-display text-display-sm leading-[1.1] tracking-[-0.28px]">
          Range Calculator
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl">
        <div className="space-y-lg">
          <div>
            <label className={labelCls}>Vehicle Range (km · WLTP/RDE rated)</label>
            <input
              type="number"
              min={0}
              value={baseRange}
              onChange={(e) => setBaseRange(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>
              AC Usage Impact: {acImpact}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={acImpact}
              onChange={(e) => setAcImpact(Number(e.target.value))}
              className="w-full accent-ink"
            />
            <p className="font-sans-label text-caption text-body mt-xs">
              0% = no AC · 100% = AC always on at max
            </p>
          </div>
          <div>
            <label className={labelCls}>
              Highway Driving: {highwayPct}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={highwayPct}
              onChange={(e) => setHighwayPct(Number(e.target.value))}
              className="w-full accent-ink"
            />
            <p className="font-sans-label text-caption text-body mt-xs">
              0% = all city · 100% = all highway
            </p>
          </div>
        </div>

        <div>
          <div className="bg-canvas-soft p-xl mb-lg">
            <Eyebrow className="block mb-sm">Real-World Range</Eyebrow>
            <p className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] text-ink">
              {formatNumber(adjustedRange)} km
            </p>
            <p className="font-serif-body text-body-serif-md text-body mt-xs">
              {reductionPct.toFixed(0)}% reduction from rated range
            </p>
          </div>

          {/* Visual range bar */}
          <div className="space-y-md">
            <div>
              <div className="flex items-center justify-between mb-xs">
                <span className="font-sans-label text-body-sm-strong text-body">Rated Range</span>
                <span className="font-sans-label text-body-sm-strong text-ink">
                  {formatNumber(baseRange)} km
                </span>
              </div>
              <div className="h-[20px] bg-canvas-soft border border-hairline">
                <div className="h-full bg-hairline" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-xs">
                <span className="font-sans-label text-body-sm-strong text-body">Adjusted Range</span>
                <span className="font-sans-label text-body-sm-strong text-ink">
                  {formatNumber(adjustedRange)} km
                </span>
              </div>
              <div className="h-[20px] bg-canvas-soft border border-hairline">
                <div
                  className="h-full bg-ink transition-all duration-300"
                  style={{ width: `${baseRange > 0 ? (adjustedRange / baseRange) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-md mt-xl pt-xl border-t border-hairline">
            <div>
              <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">AC Factor</p>
              <p className="font-sans-label text-body-sm-strong text-ink">{(acFactor * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">Speed Factor</p>
              <p className="font-sans-label text-body-sm-strong text-ink">{(highwayFactor * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">Range Loss</p>
              <p className="font-sans-label text-body-sm-strong text-accent">
                -{formatNumber(baseRange - adjustedRange)} km
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EMI Calculator
// ---------------------------------------------------------------------------
function EmiCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState(1500000);
  const [downPayment, setDownPayment] = useState(300000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureMonths, setTenureMonths] = useState(60);

  const principal = Math.max(0, vehiclePrice - downPayment);
  const monthlyRate = interestRate / 100 / 12;
  const n = tenureMonths;

  const emi =
    monthlyRate === 0
      ? principal / n
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
        (Math.pow(1 + monthlyRate, n) - 1);

  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  const principalPct = totalPayment > 0 ? (principal / totalPayment) * 100 : 0;
  const interestPct = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  const inputCls =
    'w-full bg-canvas border border-hairline px-lg py-md font-sans-label text-body-sm text-ink focus:border-ink transition-colors';
  const labelCls =
    'font-sans-label text-caption uppercase tracking-[0.4px] text-body block mb-sm';

  return (
    <div className="bg-canvas border border-hairline p-3xl">
      <div className="flex items-center gap-sm mb-xl border-b border-ink pb-md">
        <Banknote className="w-[20px] h-[20px] text-ink" />
        <h3 className="font-display text-display-sm leading-[1.1] tracking-[-0.28px]">
          EMI Calculator
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl">
        <div className="space-y-lg">
          <div>
            <label className={labelCls}>Vehicle Price (Rs)</label>
            <input
              type="number"
              min={0}
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Down Payment (Rs)</label>
            <input
              type="number"
              min={0}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className={inputCls}
            />
            {downPayment >= vehiclePrice && (
              <p className="font-sans-label text-caption text-accent mt-xs">
                Down payment exceeds vehicle price
              </p>
            )}
          </div>
          <div>
            <label className={labelCls}>Interest Rate (% per annum)</label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Tenure (months)</label>
            <input
              type="number"
              min={1}
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <div className="bg-canvas-soft p-xl mb-lg">
            <Eyebrow className="block mb-sm">Monthly EMI</Eyebrow>
            <p className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] text-ink">
              {formatPrice(Math.round(emi))}
            </p>
            <p className="font-serif-body text-body-serif-md text-body mt-xs">
              for {tenureMonths} months
            </p>
          </div>

          {/* Principal vs Interest bar */}
          <div className="mb-lg">
            <div className="flex items-center justify-between mb-xs">
              <span className="font-sans-label text-body-sm-strong text-body">Principal</span>
              <span className="font-sans-label text-body-sm-strong text-ink">
                {formatPrice(Math.round(principal))}
              </span>
            </div>
            <div className="h-[12px] bg-canvas-soft border border-hairline flex overflow-hidden">
              <div className="h-full bg-ink" style={{ width: `${principalPct}%` }} />
              <div className="h-full bg-accent" style={{ width: `${interestPct}%` }} />
            </div>
            <div className="flex items-center justify-between mt-xs">
              <span className="font-sans-label text-body-sm-strong text-body">Interest</span>
              <span className="font-sans-label text-body-sm-strong text-accent">
                {formatPrice(Math.round(totalInterest))}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-md pt-lg border-t border-hairline">
            <div>
              <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">Loan Amount</p>
              <p className="font-sans-label text-body-sm-strong text-ink">{formatPrice(principal)}</p>
            </div>
            <div>
              <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">Total Payable</p>
              <p className="font-sans-label text-body-sm-strong text-ink">
                {formatPrice(Math.round(totalPayment))}
              </p>
            </div>
            <div>
              <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">Interest %</p>
              <p className="font-sans-label text-body-sm-strong text-accent">
                {interestPct.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">Down Payment</p>
              <p className="font-sans-label text-body-sm-strong text-ink">
                {vehiclePrice > 0 ? `${((downPayment / vehiclePrice) * 100).toFixed(0)}%` : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subsidy Finder
// ---------------------------------------------------------------------------
const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal',
];

const VEHICLE_TYPES = ['2W', '3W', 'Cars', 'Commercial'];

interface SubsidyInfo {
  state: string;
  vehicleType: string;
  subsidy: string;
  roadTax: string;
  registration: string;
  extra: string;
}

function getSubsidyInfo(state: string, vehicleType: string): SubsidyInfo {
  // Delhi & Maharashtra have the most generous policies
  const isHighSubsidy = ['Delhi', 'Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Telangana'].includes(state);
  const isModerate = ['Andhra Pradesh', 'Kerala', 'Odisha', 'Rajasthan', 'Uttar Pradesh', 'Haryana', 'Punjab'].includes(state);

  let subsidyAmount = '';
  let roadTax = '';
  let registration = '';
  let extra = '';

  if (vehicleType === '2W') {
    subsidyAmount = isHighSubsidy ? 'Up to Rs 30,000' : isModerate ? 'Up to Rs 18,000' : 'Up to Rs 10,000';
  } else if (vehicleType === '3W') {
    subsidyAmount = isHighSubsidy ? 'Up to Rs 80,000' : isModerate ? 'Up to Rs 50,000' : 'Up to Rs 30,000';
  } else if (vehicleType === 'Cars') {
    subsidyAmount = isHighSubsidy ? 'Up to Rs 1.5 L' : isModerate ? 'Up to Rs 1 L' : 'Up to Rs 50,000';
  } else {
    subsidyAmount = isHighSubsidy ? 'Up to Rs 4 L' : isModerate ? 'Up to Rs 2 L' : 'Up to Rs 1 L';
  }

  roadTax = isHighSubsidy
    ? '100% exemption'
    : isModerate
      ? '50–75% exemption'
      : 'Standard rates apply';

  registration = isHighSubsidy
    ? 'Registration fee waived'
    : isModerate
      ? 'Reduced registration fee'
      : 'Standard registration fee';

  if (isHighSubsidy) {
    extra = 'Priority charging infrastructure grants available for residential complexes.';
  } else if (isModerate) {
    extra = 'Additional scrappage incentive of up to Rs 25,000 for old vehicle exchange.';
  } else {
    extra = 'Check with local RTO for the latest state-specific EV policy updates.';
  }

  return { state, vehicleType, subsidy: subsidyAmount, roadTax, registration, extra };
}

function SubsidyFinder() {
  const [state, setState] = useState('Delhi');
  const [vehicleType, setVehicleType] = useState('Cars');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<SubsidyInfo | null>(null);

  const handleSearch = () => {
    setResult(getSubsidyInfo(state, vehicleType));
    setSearched(true);
  };

  const inputCls =
    'w-full bg-canvas border border-hairline px-lg py-md font-sans-label text-body-sm text-ink focus:border-ink transition-colors';
  const labelCls =
    'font-sans-label text-caption uppercase tracking-[0.4px] text-body block mb-sm';

  return (
    <div className="bg-canvas border border-hairline p-3xl">
      <div className="flex items-center gap-sm mb-xl border-b border-ink pb-md">
        <MapPin className="w-[20px] h-[20px] text-ink" />
        <h3 className="font-display text-display-sm leading-[1.1] tracking-[-0.28px]">
          Subsidy Finder
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl">
        <div className="space-y-lg">
          <div>
            <label className={labelCls}>Select State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={inputCls}
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className={inputCls}
            >
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleSearch} size="md">
            <MapPin className="w-[14px] h-[14px] mr-sm" />
            Find Subsidies
          </Button>
          <p className="font-sans-label text-caption text-body">
            Note: Subsidy data is indicative. Verify with your state transport department.
          </p>
        </div>

        <div>
          {searched && result ? (
            <div className="bg-canvas-soft border-l-4 border-ink p-xl">
              <div className="flex items-center gap-sm mb-lg">
                <CheckCircle2 className="w-[20px] h-[20px] text-ink" />
                <h4 className="font-display text-[20px] leading-[1.15] tracking-[-0.2px]">
                  {result.state} · {result.vehicleType}
                </h4>
              </div>
              <div className="space-y-md">
                <div className="border-b border-hairline pb-md">
                  <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">
                    Purchase Subsidy
                  </p>
                  <p className="font-sans-label text-body-md-strong text-ink">{result.subsidy}</p>
                </div>
                <div className="border-b border-hairline pb-md">
                  <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">
                    Road Tax
                  </p>
                  <p className="font-sans-label text-body-md-strong text-ink">{result.roadTax}</p>
                </div>
                <div className="border-b border-hairline pb-md">
                  <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">
                    Registration
                  </p>
                  <p className="font-sans-label text-body-md-strong text-ink">{result.registration}</p>
                </div>
                <div>
                  <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">
                    Additional Benefits
                  </p>
                  <p className="font-serif-body text-body-serif-md text-body leading-snug">
                    {result.extra}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-canvas-soft p-xl h-full flex flex-col items-center justify-center text-center min-h-[200px]">
              <MapPin className="w-[32px] h-[32px] text-hairline mb-md" />
              <p className="font-serif-body text-body-serif-md text-body">
                Select your state and vehicle type, then click "Find Subsidies" to see
                available incentives.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export function ToolsPage() {
  return (
    <div className="fade-in-up">
      {/* Page hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <Eyebrow className="text-canvas-soft mb-md block">For Consumers · Tools</Eyebrow>
          <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
            EV Tools & Calculators
          </h1>
          <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[680px]">
            Run the numbers before you buy. Calculate your fuel savings, estimate real-world
            range, plan your EMI, and discover state subsidies — all in one place.
          </p>
          <div className="flex flex-wrap items-center gap-xl mt-2xl">
            <div className="flex items-center gap-sm">
              <Calculator className="w-[18px] h-[18px] text-canvas-soft" />
              <Eyebrow className="text-canvas-soft">Cost Savings</Eyebrow>
            </div>
            <div className="w-px h-[20px] bg-ink-soft" />
            <div className="flex items-center gap-sm">
              <Battery className="w-[18px] h-[18px] text-canvas-soft" />
              <Eyebrow className="text-canvas-soft">Range Estimate</Eyebrow>
            </div>
            <div className="w-px h-[20px] bg-ink-soft" />
            <div className="flex items-center gap-sm">
              <Banknote className="w-[18px] h-[18px] text-canvas-soft" />
              <Eyebrow className="text-canvas-soft">EMI Calculator</Eyebrow>
            </div>
            <div className="w-px h-[20px] bg-ink-soft" />
            <div className="flex items-center gap-sm">
              <MapPin className="w-[18px] h-[18px] text-canvas-soft" />
              <Eyebrow className="text-canvas-soft">Subsidy Finder</Eyebrow>
            </div>
          </div>
        </div>
      </section>

      {/* Calculators */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <SectionHeading eyebrow="Plan Your Purchase" title="Calculators" />

        <div className="space-y-3xl">
          <CostSavingsCalculator />
          <RangeCalculator />
          <EmiCalculator />
          <SubsidyFinder />
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-xl bg-canvas border border-hairline p-3xl">
            <div className="flex items-start gap-xl">
              <div className="w-[56px] h-[56px] bg-ink text-on-primary flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-[24px] h-[24px]" />
              </div>
              <div>
                <Eyebrow className="mb-xs block">Next Step</Eyebrow>
                <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-sm">
                  Ready to explore vehicles?
                </h2>
                <p className="font-serif-body text-body-serif-md text-body leading-snug max-w-[520px]">
                  Browse our full catalogue of EVs in India, filter by segment and budget,
                  and compare your shortlist side-by-side.
                </p>
              </div>
            </div>
            <div className="flex gap-lg">
              <Button to="/consumers/buyers-guide" className="whitespace-nowrap">
                <Car className="w-[16px] h-[16px] mr-sm" />
                Browse EVs
              </Button>
              <Button to="/consumers/compare" variant="outline" className="whitespace-nowrap">
                Compare <ArrowRight className="w-[16px] h-[16px] ml-sm" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
