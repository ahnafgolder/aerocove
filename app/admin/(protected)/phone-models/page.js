import prisma from '@/lib/prisma';
import PhoneModelManager from './PhoneModelManager';

export default async function PhoneModelsPage() {
  const phoneModels = await prisma.phoneModel.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Phone Models</h1>
      <PhoneModelManager phoneModels={phoneModels} />
    </div>
  );
}
