import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPolicyPage() {
    return (
        <>
            <Header />
            <main className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="prose lg:prose-xl">
                    <h1 className="text-4xl font-bold mb-8">Политика конфиденциальности</h1>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">1. Сбор информации</h2>
                    <p>Мы собираем информацию, которую вы предоставляете при регистрации, включая ваше имя, адрес электронной почты и платежные данные.</p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">2. Использование информации</h2>
                    <p>Ваши данные используются для предоставления услуг, обработки платежей, улучшения нашего сервиса и для связи с вами.</p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">3. Раскрытие информации</h2>
                    <p>Мы не передаем вашу личную информацию третьим лицам, за исключением случаев, предусмотренных законодательством.</p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">4. Безопасность данных</h2>
                    <p>Мы принимаем все необходимые меры для защиты ваших данных от несанкционированного доступа.</p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">5. Ваши права</h2>
                    <p>Вы имеете право на доступ, исправление или удаление вашей личной информации. Свяжитесь с нами для реализации этих прав.</p>
                </div>
            </main>
            <Footer />
        </>
    );
}
