interface IMessages {
  messages: string[];
}
export default function Logbox({ messages }: IMessages) {
  return (
    <div className="log-box">
      {messages.map((message: string, index: number) => (
        <div className={"padded-message"} key={index}>
          {message}
        </div>
      ))}
    </div>
  );
}
