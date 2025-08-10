import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function TermsOfUsePage() {
    return (
        <>
            <Header />
            <main className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="prose lg:prose-xl">
                    <h1 className="text-4xl font-bold mb-8">Условия использования</h1>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">1. Введение</h2>
                    <p>Добро пожаловать на IshTop.Uz. Используя наш сайт, вы соглашаетесь с настоящими Условиями использования. Пожалуйста, внимательно ознакомьтесь с ними.</p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">2. Услуги</h2>
                    <p>IshTop.Uz предоставляет платформу для фрилансеров и заказчиков для поиска проектов и сотрудничества. Мы не являемся стороной договоров между пользователями.</p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">3. Обязательства пользователей</h2>
                    <p>Вы обязуетесь предоставлять точную информацию при регистрации и не нарушать права третьих лиц. Запрещено размещение незаконного контента.</p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">4. Ограничение ответственности</h2>
                    <p>Мы не несем ответственности за качество услуг, предоставляемых фрилансерами, или за любые убытки, возникшие в результате использования платформы.</p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">5. Изменения в Условиях</h2>
                    <p>Мы оставляем за собой право изменять эти Условия в любое время. Продолжая использовать сайт после изменений, вы соглашаетесь с новой версией Условий.</p>
                </div>
            </main>
            <Footer />
        </>
    );
}
