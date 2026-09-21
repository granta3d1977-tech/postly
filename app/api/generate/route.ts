import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const styles = ["Вирусный", "Продающий", "Экспертный"] as const;
type Style = (typeof styles)[number];

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Требуется авторизация." }, { status: 401 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Не задан GROQ_API_KEY. Добавьте ключ в .env.local и перезапустите сервер." },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as { topic?: unknown; style?: unknown };
    const topic = typeof body.topic === "string" ? body.topic.trim() : "";
    const style: Style = styles.includes(body.style as Style) ? (body.style as Style) : "Экспертный";

    if (topic.length < 3 || topic.length > 300) {
      return NextResponse.json({ error: "Тема должна содержать от 3 до 300 символов." }, { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    // User ID is intentionally resolved on the server. It is ready to be stored
    // with a generation when persistent storage is added.
    const userId = session.user.id;
    let posts: string[] = [];
    // Иногда модель пропускает разделитель. Один повтор делает этот случай незаметным для пользователя.
    for (let attempt = 0; attempt < 2 && posts.length !== 3; attempt += 1) {
      const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
        temperature: 0.9,
        max_completion_tokens: 3200,
        messages: [
          { role: "system", content: "Ты сильный русскоязычный SMM-копирайтер. Создавай только контент, который запрашивает пользователь. Не используй JSON и не добавляй пояснений." },
          { role: "user", content: `Создай ровно 3 разных варианта поста для Telegram на тему: «${topic}». Стиль: «${style}». Каждый вариант: примерно 500 символов (допустимо 430–600), живой русский язык, 2–5 уместных эмодзи и 2–4 релевантных хештега в конце. Не добавляй заголовки «Вариант 1» внутри текста. Между каждым вариантом поставь на отдельной строке строго разделитель ===POST===.` },
        ],
      });
      const raw = completion.choices[0]?.message.content;
      if (!raw) continue;
      // gpt-oss-20b в Groq иногда отклоняет даже валидную JSON Schema на стороне API.
      // Обычный текст с явным разделителем надёжнее и не зависит от этой особенности модели.
      posts = raw.split(/\s*===POST===\s*/).map((post) => post.trim()).filter(Boolean);
    }

    if (posts.length !== 3) throw new Error("Модель вернула неверный формат");
    return NextResponse.json({ posts, userId });
  } catch (error) {
    const status = typeof error === "object" && error && "status" in error && typeof error.status === "number" ? error.status : 500;
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: status >= 400 && status < 500 ? "Сервис генерации отклонил запрос. Попробуйте ещё раз." : "Не удалось сгенерировать посты. Попробуйте ещё раз." },
      { status: status >= 400 && status < 500 ? 502 : 500 },
    );
  }
}
