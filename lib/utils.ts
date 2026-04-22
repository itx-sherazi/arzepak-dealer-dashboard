export const formatPrice = (price: number) => {
  if (price >= 10000000) return `PKR ${(price / 10000000).toFixed(1)} Crore`;
  if (price >= 100000)   return `PKR ${(price / 100000).toFixed(1)} Lac`;
  return `PKR ${price.toLocaleString()}`;
};

export const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

export const CITIES = ['Lahore','Karachi','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta','Sialkot','Gujranwala'];
export const PROPERTY_TYPES = ['HOUSE','APARTMENT','PLOT','COMMERCIAL','FARMHOUSE','ROOM'];
export const AREA_UNITS = ['MARLA','KANAL','SQFT','SQYD'];
export const AMENITIES = ['Parking','Generator','CCTV','Gas','Electricity','Water Supply','Gym','Swimming Pool','Internet','Security Guard','Elevator','Central Cooling','Central Heating','Servant Quarters','Garden'];

export const statusColor = (status: string) => ({
  ACTIVE:    'bg-green-100 text-green-700',
  PENDING:   'bg-yellow-100 text-yellow-700',
  REJECTED:  'bg-red-100 text-red-700',
  EXPIRED:   'bg-gray-100 text-gray-600',
  SOLD:      'bg-blue-100 text-blue-700',
  RENTED:    'bg-purple-100 text-purple-700',
  SUSPENDED: 'bg-red-100 text-red-700',
  NEW:       'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700',
  CONVERTED: 'bg-green-100 text-green-700',
  CLOSED:    'bg-gray-100 text-gray-600',
}[status] ?? 'bg-gray-100 text-gray-600');

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
