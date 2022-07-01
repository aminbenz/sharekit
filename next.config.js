// const ContentSecurityPolicy = `
//   default-src 'self';
//   script-src 'self';
//   child-src example.com;
//   style-src 'self' example.com;
//   font-src 'self';
// `;

// module.exports = {
//   images: {
//     domains: ['tailwindui.com'],
//   },
//   async headers() {
//     return [
//       {
//         source: '/test',
//         headers: [
//           {
//             key: 'Content-Security-Policy',
//             value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
//           },
//         ],
//       },
//     ];
//   },
// };

module.exports = {
  images: {
    domains: ['tailwindui.com'],
  },
};
