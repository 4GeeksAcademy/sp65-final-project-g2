import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Context } from "../store/appContext.js";
import "../../styles/chatBot.css";

const ChatBot = () => {
    const { store } = useContext(Context);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [exercises, setExercises] = useState([]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen && store.isLogin) {
            setMessages([{ sender: "bot", text: "Hello, My name is ABA-bot. How can I assist you today?" }]);
        }
    };

    const handleSend = async () => {
        if (input.trim() === "") return;

        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);
        setInput("");

        try {
            const apiKey = "sk-working-jTi2ael7bon59Y7LxsI1T3BlbkFJz0A8yAesJTsWectigtkt";
            console.log('OpenAI API Key:', apiKey);

            if (!apiKey) {
                throw new Error('API Key not found');
            }

            const exerciseList = Array.isArray(exercises)
                ? exercises.map(ex => `<a href="${process.env.BACKEND_URL}/exercises?search=${encodeURIComponent(ex.name)}">${ex.name}</a>`).join("\n")
                : "No hay ejercicios disponibles.";

            const initialPrompt = {
                role: "system",
                content: `Eres un asistente útil en una aplicación de fitness ABA Fitness. Propondras rutinas en base a la lista de ejercicios que te muestro después, dietas y alternativas si hay lesiones o dificultades, además propón siempre que puedas cuantas repeticiones, descasnos y set en función de la consulta y necesidad del usuario. No deberías de responder a nada que no sea algo de esto que te digo. Sé respetuoso y responde en el idioma en el que se te escriba. 
                        Solo puedes basar tus respuestas en base a la siguiente lista de ejercicios, solamente propón ejercicios de esta lista:shoulder press, push-up medicine ball, smith back shrug, side lying floor stretch, calf push stretch with hands against wall, dumbbell one arm press on exercise ball, dumbbell side bend, barbell standing leg calf raise, smith standing behind head military press, dumbbell peacher hammer curl, incline twisting sit-up, dumbbell arnold press v. 2, push-up (wall) v. 2, cable underhand pulldown, kettlebell bent press, dumbbell seated alternate front raise, outside leg kick push-up, cable side bend crunch (bosu ball), rear decline bridge, smith incline shoulder raises, single leg squat (pistol) male, kettlebell one arm snatch, cable one arm incline fly on exercise ball, band one arm single leg split squat, exercise ball on the wall calf raise (tennis ball between ankles), butterfly yoga pose, russian twist, cable reverse curl, lever shoulder press v. 3, cable two arm tricep kickback, barbell floor calf raise, curtsey squat, dumbbell lying pronation on floor, exercise ball seated triceps stretch, barbell full squat (back pov), handstand, band v-up, landmine lateral raise, barbell split squat v. 2, otis up, kettlebell double jerk, barbell standing wide military press, dumbbell incline fly, seated side crunch (wall), weighted lunge with swing, single leg bridge with outstretched leg, assisted motion russian twist, kettlebell bottoms up clean from the hang position, chest dip (on dip-pull-up cage), lever incline chest press v. 2, full planche, barbell bent arm pullover, cable one arm lateral bent-over, band horizontal pallof press, cable reverse wrist curl, barbell lying close-grip triceps extension, bench hip extension, barbell standing rocking leg calf raise, dumbbell seated one leg calf raise - hammer grip, deep push up, barbell sitted alternate leg raise (female), dumbbell incline two arm extension, dumbbell lying one arm rear lateral raise, dumbbell twisting bench press, barbell wrist curl v. 2, smith full squat, band fixed back close grip pulldown, exercise ball alternating arm ups, barbell lying extension, cable standing wide grip biceps curl, exercise ball hug, dumbbell rotation reverse fly, dumbbell rear delt row_shoulder, kettlebell seesaw press, dumbbell reverse wrist curl, suspended split squat, basic toe touch (male), dumbbell one arm hammer preacher curl, wide-grip chest dip on high parallel bars, band underhand pulldown, lever narrow grip seated row, dumbbell standing alternating tricep kickback, oblique crunch v. 2, assisted standing triceps extension (with towel), dumbbell incline press on exercise ball, smith shrug, london bridge, dumbbell biceps curl (with arm blaster), cocoons, dumbbell decline bench press, backward jump, dumbbell over bench revers wrist curl, bodyweight standing one arm row (with towel), assisted lying leg raise with lateral throw down, dumbbell standing calf raise, barbell standing back wrist curl, dumbbell one arm fly on exercise ball, reverse dip, forward jump, inverted row bent knees, dumbbell seated bent over triceps extension, dumbbell incline one arm fly, dumbbell incline one arm fly on exercise ball, dumbbell incline row, barbell side split squat v. 2, triceps dips floor, 3/4 sit-up, dumbbell alternate biceps curl, decline sit-up, peroneals stretch, dumbbell standing alternate overhead press, smith reverse grip bent over row, barbell reverse close-grip bench press, cable cross-over lateral pulldown, dumbbell neutral grip bench press, chest tap push-up (male), dumbbell decline shrug v. 2, walking on incline treadmill, dumbbell straight leg deadlift, band two legs calf raise - (band under both legs) v. 2, dumbbell seated neutral wrist curl.
                        chin-up, dumbbell one arm bench fly, wide hand push up, assisted chest dip (kneeling), cable floor seated wide-grip row, barbell clean and press, cable reverse crunch, barbell incline bench press, side bridge hip abduction, close-grip push-up, side hip (on parallel bars), cable standing crunch, suspended push-up, dumbbell fly on exercise ball, barbell incline close grip bench press, star jump (male), twisted leg raise, kettlebell plyo push-up,
                        Ten en cuenta también el número máximo de caracteres que puedes mostrar e intenta que el texto no se corte cuando respondas.`
            };

            const response = await axios.post("https://api.openai.com/v1/chat/completions", {
                model: "gpt-4",
                messages: [initialPrompt, { role: "user", content: input }],
                max_tokens: 150
            }, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            });

            const botResponse = response.data.choices[0].message.content;

            const maxMessageLength = 1500;
            const splitMessages = botResponse.match(new RegExp('.{1,' + maxMessageLength + '}', 'g'));

            const botMessages = splitMessages.map(msg => ({ sender: "bot", text: msg }));
            setMessages([...messages, userMessage, ...botMessages]);
            setError("");
        } catch (error) {
            console.error("Error sending message:", error);
            setError("Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.");

            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
                if (error.response.data.error.type === "insufficient_quota") {
                    setError("Has superado tu cuota de API. Por favor, verifica tu plan y detalles de facturación.");
                }
            } else if (error.request) {
                console.error("Request data:", error.request);
            } else {
                console.error('Error', error.message);
            }
        }
    };

    if (!store.isLogin) {
        return null;
    }

    return (
        <div className="chatbot-container">
            <div className={`chatbot-icon ${isOpen ? "open" : ""}`} onClick={toggleChat}>
                {isOpen ? <span style={{ color: 'black' }}>❌</span> : '💬'}
            </div>
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`} dangerouslySetInnerHTML={{ __html: msg.text }}>
                            </div>
                        ))}
                    </div>
                    {error && <div className="chatbot-error">{error}</div>}
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
