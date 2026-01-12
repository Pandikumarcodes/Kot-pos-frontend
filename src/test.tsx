import Button from "./design-system/atoms/Button/Button";

export default function TestTailwind() {
  return (
    <div className="p-6 space-y-4">
      <Button>Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="danger">Danger Button</Button>
    </div>
  );
}
