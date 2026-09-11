# CanteenQ — fixed runnable build

A React Native + Expo + Firebase college canteen pre-order app.

## Run on your Mac

```bash
cd CanteenQ-starter
npm install
npm start
```

### Web
```bash
npm run web
```

### iPhone simulator
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Firebase

The project already contains the Firebase web configuration in `src/firebase/config.ts`.
For real login/orders, the Firebase project must have:

1. Authentication → Email/Password enabled.
2. Firestore Database created.
3. `food_items` documents added (or the app will show built-in demo food).
4. Firestore rules/indexes deployed.
5. Cloud Functions deployed for authoritative order creation.

Deploy backend from the project root:

```bash
npm install -g firebase-tools
firebase login
firebase use ceentenq
firebase deploy --only firestore:rules,firestore:indexes,storage,functions
```

## What was fixed

- React Navigation v7 `id` type errors.
- Missing `Field` component and shared UI styles.
- Broken/placeholder Cart, Orders and Search screens.
- Authentication routing: Login/Register/Forgot Password now actually lead into the app.
- Student/staff/admin role routing.
- Cart quantity controls, totals, clear/remove actions and checkout navigation.
- Home menu with Firestore data + demo fallback, search and category filtering.
- Orders screen filtered to the signed-in student.
- Staff queue status progression and rejection.
- Admin dashboard metrics.
- Safer auth profile fallback when a user profile document is missing.
- Checkout item count now counts quantities, not unique line items.
- Preserved the existing orange/cream CanteenQ visual theme.

## Important

The Cloud Function remains the source of truth for food prices, availability, order totals and token numbers. The client must not be trusted for those values.
