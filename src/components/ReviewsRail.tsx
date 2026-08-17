import { FormEvent, useEffect, useState } from 'react';
import { createReview, loadReviews, Review } from '../lib/reviews';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export function ReviewsRail() {
  const [authorName, setAuthorName] = useState('');
  const [text, setText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [message, setMessage] = useState('');

  async function refresh() {
    if (!isSupabaseConfigured) return;
    const { data } = await loadReviews();
    setReviews((data ?? []) as Review[]);
  }

  useEffect(() => {
    async function init() {
      if (!isSupabaseConfigured) return;
      const { data } = await supabase.auth.getSession();
      setIsSignedIn(Boolean(data.session));
      await refresh();
    }
    void init();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    if (!isSignedIn) {
      setMessage('Войдите, чтобы оставить отзыв.');
      return;
    }
    const { error } = await createReview(text.trim(), authorName.trim() || 'Пользователь');
    if (error) setMessage('Не получилось сохранить отзыв.');
    else {
      setText('');
      setMessage('Спасибо, отзыв появился в списке.');
      await refresh();
    }
  }

  return (
    <section className="reviews-rail" aria-label="Отзывы пользователей">
      <div className="reviews-rail__mark" aria-hidden="true">★</div>
      <div className="reviews-rail__body">
        <h2>Отзывы</h2>
        <form onSubmit={submit}>
          <input onChange={(event) => setAuthorName(event.target.value)} placeholder="Ваше имя" value={authorName} />
          <textarea onChange={(event) => setText(event.target.value)} placeholder="Что стало проще?" rows={3} value={text} />
          <button disabled={!text.trim()} type="submit">Оставить отзыв</button>
        </form>
        {message && <p className="reviews-rail__message">{message}</p>}
        <div className="reviews-rail__list">
          {reviews.length > 0 ? reviews.map((review) => (
            <article key={review.id}>
              <strong>{review.author_name}</strong>
              <p>{review.text}</p>
            </article>
          )) : (
            <p>Пока тихо. Можно стать первым человеком, который скажет: «рутины меньше».</p>
          )}
        </div>
      </div>
    </section>
  );
}
