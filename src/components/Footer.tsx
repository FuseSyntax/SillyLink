export default function Footer() {
  return (
    <footer className="bg-primary mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-2">
          <p>© {new Date().getFullYear()} SillyLink. All rights reserved.</p>
          <p className="text-sm opacity-80">
            Simple and efficient URL shortening
          </p>
        </div>
      </div>
    </footer>
  );
}