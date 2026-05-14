import 'dotenv/config'
import { prisma } from '../lib/prisma'

const blocks = [
  {
    label: 'Allow Copy/Paste Bookmarklet',
    content: `javascript: (function () {
  allowCopyAndPaste = function (e) {
    e.stopImmediatePropagation();
    return true;
  };
  document.addEventListener("copy", allowCopyAndPaste, true);
  document.addEventListener("paste", allowCopyAndPaste, true);
  document.addEventListener("onpaste", allowCopyAndPaste, true);
})();`,
    isCode: true,
    language: 'javascript',
    date: '2026-05-14',
    pinned: true,
  },
  {
    label: 'DSA - 11 May Code 1 (C++)',
    content: `#include <iostream>
using namespace std;
class Node {
public:
    int data;
    Node* next;
    Node(int val) {
        data = val;
        next = nullptr;
    }
};
class LinkedList {
public:
    Node* head;
    LinkedList() {
        head = nullptr;
    }
    // Insert at front
    void insertFront(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
    }
    // Remove first node
    void removeFront() {
        if (head == nullptr)
            return;
        Node* temp = head;
        head = head->next;
        delete temp;
    }
    // Display list
    void display() {
        Node* temp = head;
        while (temp != nullptr) {
            cout << temp->data;
            if (temp->next != nullptr)
                cout << " ";
            temp = temp->next;
        }
    }
};
int main() {
    int n;
    cin >> n;
    LinkedList list;
    int x;
    for (int i = 0; i < n; i++) {
        cin >> x;
        list.insertFront(x);
    }
    // Remove first customer
    list.removeFront();
    // Display remaining customers
    list.display();
    return 0;
}`,
    isCode: true,
    language: 'cpp',
    date: '2026-05-11',
    pinned: false,
  },
  {
    label: 'FUNDAMENTALS - 11 May Code 2 (C++)',
    content: `#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long pairs = (n * (n - 1)) / 2;
    cout << pairs;
    return 0;
}`,
    isCode: true,
    language: 'cpp',
    date: '2026-05-11',
    pinned: false,
  },
  {
    label: 'DSA - 12 May Code 1 (C++)',
    content: `#include <iostream>
using namespace std;
struct Node {
    int data;
    Node* prev;
    Node* next;
    Node(int val) {
        data = val;
        prev = next = nullptr;
    }
};
int main() {
    int n;
    cin >> n;
    if (n == 0) return 0;
    Node* head = nullptr;
    Node* tail = nullptr;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        Node* newNode = new Node(x);
        if (!head) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            newNode->prev = tail;
            tail = newNode;
        }
    }
    int k;
    cin >> k;
    k = k % n;
    if (k == 0) {
        Node* temp = head;
        while (temp) {
            cout << temp->data;
            if (temp->next) cout << " ";
            temp = temp->next;
        }
        return 0;
    }
    // Make circular
    tail->next = head;
    head->prev = tail;
    int steps = n - k;
    Node* newTail = head;
    for (int i = 1; i < steps; i++) {
        newTail = newTail->next;
    }
    Node* newHead = newTail->next;
    // Break circle
    newTail->next = nullptr;
    newHead->prev = nullptr;
    Node* temp = newHead;
    while (temp) {
        cout << temp->data;
        if (temp->next) cout << " ";
        temp = temp->next;
    }
    return 0;
}`,
    isCode: true,
    language: 'cpp',
    date: '2026-05-12',
    pinned: false,
  },
  {
    label: 'FUNDAMENTALS - 12 May Code 2 (C++)',
    content: `#include <iostream>
using namespace std;
int main() {
    char health, location, gender;
    int age;
    cin >> health >> location >> gender >> age;
    if (age < 25 || age > 35) {
        cout << "Not Insured";
    }
    else if (health == 'e' && location == 'c' && gender == 'm') {
        cout << "The Premium Is Rs.4 Per Thousand And His Policy Cannot Exceed Rs.2 Lakhs";
    }
    else if (health == 'e' && location == 'c' && gender == 'f') {
        cout << "The Premium Is Rs.3 Per Thousand And Her Policy Cannot Exceed Rs.1 Lakhs";
    }
    else if (health == 'p' && location == 'v' && gender == 'm') {
        cout << "The Premium Is Rs.6 Per Thousand And Cannot Exceed Rs. 10,000";
    }
    else {
        cout << "Not Insured";
    }
    return 0;
}`,
    isCode: true,
    language: 'cpp',
    date: '2026-05-12',
    pinned: false,
  },
  {
    label: 'FUNDAMENTALS - 12 May Code 2 (Python)',
    content: `health = input().strip()
location = input().strip()
gender = input().strip()
age = int(input().strip())
if age < 25 or age > 35:
    print("Not Insured")
elif health == 'e' and location == 'c' and gender == 'm':
    print("The Premium Is Rs.4 Per Thousand And His Policy Cannot Exceed Rs.2 Lakhs")
elif health == 'e' and location == 'c' and gender == 'f':
    print("The Premium Is Rs.3 Per Thousand And Her Policy Cannot Exceed Rs.1 Lakhs")
elif health == 'p' and location == 'v' and gender == 'm':
    print("The Premium Is Rs.6 Per Thousand And Cannot Exceed Rs. 10,000")
else:
    print("Not Insured")`,
    isCode: true,
    language: 'python',
    date: '2026-05-12',
    pinned: false,
  },
  {
    label: 'FUNDAMENTALS - 12 May Code 3 (C++)',
    content: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    if (a == 0 && b == 0)
        cout << "Origin";
    else if (a > 0 && b > 0)
        cout << "Ist Quadrant";
    else if (a < 0 && b > 0)
        cout << "IInd Quadrant";
    else if (a < 0 && b < 0)
        cout << "IIIrd Quadrant";
    else if (a > 0 && b < 0)
        cout << "IVth Quadrant";
    return 0;
}`,
    isCode: true,
    language: 'cpp',
    date: '2026-05-12',
    pinned: false,
  },
  {
    label: 'FUNDAMENTALS - 12 May Code 3 (Python)',
    content: `a = int(input().strip())
b = int(input().strip())
if a == 0 and b == 0:
    print("Origin")
elif a > 0 and b > 0:
    print("Ist Quadrant")
elif a < 0 and b > 0:
    print("IInd Quadrant")
elif a < 0 and b < 0:
    print("IIIrd Quadrant")
elif a > 0 and b < 0:
    print("IVth Quadrant")`,
    isCode: true,
    language: 'python',
    date: '2026-05-12',
    pinned: false,
  },
  {
    label: 'DSA - 13 May Code 1 (C++)',
    content: `#include <iostream>
#include <string>
using namespace std;
struct Node {
    string data;
    Node* next;
    Node(string val) {
        data = val;
        next = nullptr;
    }
};
int main() {
    Node* head = nullptr;
    Node* tail = nullptr;
    string input;
    bool hasData = false;
    while (true) {
        cin >> ws;
        getline(cin, input);
        if (input == "exit") break;
        Node* newNode = new Node(input);
        hasData = true;
        if (!head) {
            head = tail = newNode;
            tail->next = head;
        } else {
            tail->next = newNode;
            tail = newNode;
            tail->next = head;
        }
    }
    cout << "Circular Linked List - Running Applications";
    if (!hasData) {
        cout << " No applications to iterate";
        return 0;
    }
    cout << " Running Applications:";
    Node* temp = head;
    do {
        cout << " " << temp->data;
        temp = temp->next;
    } while (temp != head);
    return 0;
}`,
    isCode: true,
    language: 'cpp',
    date: '2026-05-13',
    pinned: false,
  },
  {
    label: 'DSA - 13 May Code 1 (Python)',
    content: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
head = None
tail = None
hasData = False
while True:
    try:
        s = input().strip()
    except:
        break
    if s == "exit":
        break
    newNode = Node(s)
    hasData = True
    if head is None:
        head = tail = newNode
        tail.next = head
    else:
        tail.next = newNode
        tail = newNode
        tail.next = head
print("Circular Linked List - Running Applications", end="")
if not hasData:
    print(" No applications to iterate")
else:
    print(" Running Applications:", end="")
    temp = head
    while True:
        print(" " + temp.data, end="")
        temp = temp.next
        if temp == head:
            break`,
    isCode: true,
    language: 'python',
    date: '2026-05-13',
    pinned: false,
  },
  {
    label: 'FUNDAMENTALS - 13 May Code 2 (C++)',
    content: `#include <iostream>
using namespace std;
int main() {
    int m;
    cin >> m;
    while (m--) {
        int x, y;
        cin >> x >> y;
        int z = x + y;
        int k = (x * 100) / z;
        cout << z << " seconds\\n";
        cout << "Time Gap Ratio: " << k << "%";
        if (m) cout << "\\n";
    }
    return 0;
}`,
    isCode: true,
    language: 'cpp',
    date: '2026-05-13',
    pinned: false,
  },
  {
    label: 'FUNDAMENTALS - 13 May Code 3 (Python)',
    content: `m = int(input())
while m:
    x, y = map(int, input().split())
    z = x + y
    k = (x * 100) // z
    print(f"{z} seconds")
    print(f"Time Gap Ratio: {k}%", end="" if m == 1 else "\\n")
    m -= 1`,
    isCode: true,
    language: 'python',
    date: '2026-05-13',
    pinned: false,
  },
  {
    label: 'FUNDAMENTALS - 13 May Code 4 (C++)',
    content: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int sum = 0, i = 1;
    do {
        if (n % i == 0)
            sum += i;
        i++;
    } while (i <= n / 2);
    if (sum == n)
        cout << n << " is a perfect number ";
    else
        cout << n << " is not a perfect number ";
    return 0;
}`,
    isCode: true,
    language: 'cpp',
    date: '2026-05-13',
    pinned: false,
  },
  {
    label: 'FUNDAMENTALS - 13 May Code 4 (Python)',
    content: `n = int(input())
sum_div = 0
i = 1
while True:
    if i > n // 2:
        break
    if n % i == 0:
        sum_div += i
    i += 1
if sum_div == n:
    print(f"{n} is a perfect number ", end="")
else:
    print(f"{n} is not a perfect number ", end="")`,
    isCode: true,
    language: 'python',
    date: '2026-05-13',
    pinned: false,
  },
]

async function main() {
  await prisma.block.deleteMany()
  await prisma.block.createMany({ data: blocks })
  console.log(`Seeded ${blocks.length} actual blocks successfully`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
