import { analyzePassword } from "../utils/pswdStrength";

type Props = {
  password: string;
};

export default function PasswordStrength({ password }: Props) {
  const { checks, score, label } = analyzePassword(password);

  const width = `${(score / 5) * 100}%`;

  const getColor = () => {
    if (label === "Weak") return "red";
    if (label === "Medium") return "orange";
    return "green";
  };

  const CheckItem = ({ ok, text }: { ok: boolean; text: string }) => (
    <li style={{ color: ok ? "green" : "gray" }}>
      {ok ? "✔" : "✖"} {text}
    </li>
  );

  return (
    <div style={{ marginTop: "10px" }}>
      {/* Strength bar */}
      <div style={{ height: "8px", background: "#eee" }}>
        <div
          style={{
            width,
            height: "100%",
            background: getColor(),
            transition: "0.3s",
          }}
        />
      </div>

      {/* Label */}
      <p style={{ color: getColor(), margin: "5px 0" }}>{label}</p>

      {/* Checklist */}
      <ul style={{ paddingLeft: "20px", margin: 0 }}>
        <CheckItem ok={checks.length} text="At least 8 characters" />
        <CheckItem ok={checks.upper} text="Contains uppercase letter" />
        <CheckItem ok={checks.lower} text="Contains lowercase letter" />
        <CheckItem ok={checks.number} text="Contains number" />
        <CheckItem ok={checks.special} text="Contains special character" />
      </ul>
    </div>
  );
}