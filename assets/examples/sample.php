<?php
// Single-line comment
# Another comment
/* Multi-line
   comment */

declare(strict_types=1);

namespace MyApp;

interface Logger {
    public function log(string $message): void;
}

trait Loggable {
    abstract public function save();
}

class User implements Logger {
    use Loggable;

    const MAX = 100;
    private string $name;

    public function __construct(
        public readonly int $id
    ) {}

    public function log(string $message): void {
        echo <<<HTML
        <div>$message</div>
        HTML;
    }

    public static function create(): static {
        return new static(1);
    }
}

fn($x) => $x * 2;
