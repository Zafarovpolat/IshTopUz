import { Suspense } from 'react';
import { SurveyForm } from '@/components/sections/survey-form';

export default function SurveyPage() {
    return (
        <div className="bg-background text-foreground min-h-screen">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
                <SurveyForm />
            </Suspense>
        </div>
    );
}