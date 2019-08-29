# CLI

> A minimalistic framework for building CLIs.

![CircleCI](https://img.shields.io/circleci/build/github/markusylisiurunen/cli/master.svg)

A framework for building CLIs with Node.js. This project takes a minimalistic approach and tries to
enable building CLI applications with minimal effort and great DX/UX.

> NOTE! This project is currently work in progress and most likely will not work at all. It is not
> recommended to use in any real project at the moment.

## The problem

Work in progress.

## This solution

Work in progress.

## Table of contents

1. [Installation](#installation)
2. [Usage](#usage)
   1. [Example](#example)
   2. [Custom views](#custom-views)
3. [Features](#features)
   1. [UI](#ui)
      1. [log](#log)
      2. [task](#task)
         1. [setStatus](#setstatus)
      3. [askBoolean](#askboolean)
         1. [waitForAnswer](#waitforanswer)
      4. [askEnum](#askenum)
         1. [waitForAnswer](#waitforanswer)
      5. [askNumber](#asknumber)
         1. [waitForAnswer](#waitforanswer)
      6. [askString](#askstring)
         1. [waitForAnswer](#waitforanswer)
4. [License](#license)

## Installation

To install the CLI helper, run the following command.

```sh
npm install -g @markusylisiurunen/cli
```

To install it as a project's dependency, run the following command.

```sh
npm add @markusylisiurunen/cli
```

## Usage

Work in progress.

### Example

The example below will give you the following features out of the box.

- Listing of all available commands via top level `--help`, `-h` or `help`.
- Command help documentation via `--help`, `-h` or `help`.
- Flag parsing and validation, and helpful error messages.
- Automatic interactive population of the flags.
- Interactive UI views via `this.ui.<view_name>`.

```ts
import cli from "@markusylisiurunen/cli";

interface ISayHelloCommandFlags {
  name: string;
  age: number;
}

class SayHelloCommand extends cli.Command {
  public name = "say-hello";
  public description = "Say hello to a human being.";

  public flagDefinitions = [
    this.flags.string("name", "n", "Human's name.", {}),
    this.flags.number("age", "a", "Human's age.", {}),
  ];

  private async fetchGreeting(): Promise<string> {
    return new Promise((resolve) => setTimeout(() => resolve("Hello"), 2000));
  }

  public async run(flags: ISayHelloCommandFlags): Promise<void> {
    const fetchGreetingTask = this.ui.task("Retrieving the greeting.");

    try {
      const greeting = await this.fetchGreeting();
      fetchGreetingTask.setStatus("completed");

      this.ui.log(`${greeting}, ${flags.name}. You are ${flags.age} years old.`);
    } catch (error) {
      fetchGreetingTask.setStatus("failed");
      process.exit(1);
    }
  }
}

cli.register(new SayHelloCommand());

cli.run({ name: "test" });
```

### Custom views

If you want to create your own custom views, you can extend the base view class. Below is an example
of a view which logs whatever you give it with caps-lock on.

```ts
import cli from "@markusylisiurunen/cli";

export interface IUIViewCapsLockProps {
  text: string;
}

export interface IUIViewCapsLockOptions {}

interface IUIViewCapsLockState {
  text: string;
}

class UIViewCapsLock extends cli.UIViewBase<IUIViewCapsLockState> {
  public constructor(
    parent: cli.UIViewBase | null,
    props: IUIViewCapsLockProps,
    _options: Partial<IUIViewCapsLockOptions>,
  ) {
    super(parent);
    this.state = { text: props.text };
  }

  public render(): number {
    cli.stdout.write(`${this.state.text.toUpperCase()}\n`);
    return this.state.text.split("\n").length;
  }
}
```

To use this class, you can do the following inside a `Command` class.

```ts
this.ui.customView((p) => new UIViewCapsLock(p, { text: "Hello, world!" }, {}));
```

## Features

This section goes through most of the features this library offers.

### UI

All views can be accessed from an instance of `Command`. They are located under
`this.ui.<view_name>`.

#### log

```ts
function log(props: any): void {}
```

Creates a basic log view which can be used to simulate the functionality of `console.log`. `props`
can be of any type and it will be converted to string if it is not yet one.

Prefer using this rather than raw `console.log`s as they might not work the best with the custom
view render engine as they cannot be controlled by the engine.

#### task

```ts
type TUIViewTaskStatus = "running" | "completed" | "failed";

interface IUIViewTaskProps {
  text: string;
}

interface IUIViewTaskOptions {
  status: TUIViewTaskStatus;
}

function task(
  props: IUIViewTaskProps | string,
  options: Partial<IUIViewTaskOptions> = {},
): UIViewTask {}
```

Creates a new task view which can be updated to reflect the status of an asynchronous task. It must
have one of the three possible statuses. `props` can be either the full props object or a string in
which case it will be treated as the `text` property.

##### setStatus

```ts
type TUIViewTaskStatus = "running" | "completed" | "failed";

function setStatus(status: TUIViewTaskStatus): void {}
```

Update the status of the task view. The view will be automatically updated to reflect the new
status. The status must be one of the valid statuses.

#### askBoolean

```ts
interface IUIQuestionViewBooleanProps {
  question: string;
}

interface IUIQuestionViewBooleanOptions {}

function askBoolean(
  props: IUIQuestionViewBooleanProps | string,
  options: Partial<IUIQuestionViewBooleanOptions> = {},
): UIQuestionViewBoolean {}
```

Creates an interactive view for asking questions of which the answer should be a boolean. The
`props` can be either the full props object or a string in which case it will be treated as the
`question` property.

##### waitForAnswer

```ts
function waitForAnswer(): Promise<boolean> {}
```

Waits for the user's answer to the question. It will either return the boolean value or throw if the
user does not answer with a valid answer.

#### askEnum

```ts
interface IUIQuestionViewEnumProps {
  question: string;
  choices: string[];
}

interface IUIQuestionViewEnumOptions {}

function askEnum(
  props: IUIQuestionViewEnumProps,
  options: Partial<IUIQuestionViewEnumOptions> = {},
): UIQuestionViewEnum {}
```

Creates an interactive view for asking questions of which the answer should be one of enum's values.

##### waitForAnswer

```ts
function waitForAnswer(): Promise<string> {}
```

Waits for the user's answer to the question. It will either return the enum value or throw if the
user does not answer with a valid answer.

#### askNumber

```ts
interface IUIQuestionViewNumberProps {
  question: string;
}

interface IUIQuestionViewNumberOptions {}

function askNumber(
  props: IUIQuestionViewNumberProps | string,
  options: Partial<IUIQuestionViewNumberOptions> = {},
): UIQuestionViewNumber {}
```

Creates an interactive view for asking questions of which the answer should be a number.

##### waitForAnswer

```ts
function waitForAnswer(): Promise<number> {}
```

Waits for the user's answer to the question. It will either return a number or throw if the user
does not answer with a valid answer.

#### askString

```ts
interface IUIQuestionViewStringProps {
  question: string;
}

interface IUIQuestionViewStringOptions {}

function askString(
  props: IUIQuestionViewStringProps | string,
  options: Partial<IUIQuestionViewStringOptions> = {},
): UIQuestionViewString {}
```

Creates an interactive view for asking questions of which the answer should be a free-form string.

##### waitForAnswer

```ts
function waitForAnswer(): Promise<string> {}
```

Waits for the user's answer to the question. It will either return a string or throw if the user
does not answer with a valid answer.

## License

Work in progress.
