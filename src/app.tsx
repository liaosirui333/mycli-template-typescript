import $i18n from 'panda-i18n'; /* eslint-disable @iceworks/best-practices/no-secret-info */
import * as React from 'react';
import { runApp, IAppConfig, APP_MODE } from 'ice';
// import LocaleProvider from '@/components/LocaleProvider';
// import { getLocale } from '@/locales/locale';
import { Message } from '@fpxfd/next';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import packageJson from '../package.json';

// 设置cookie取值字段名
// $i18n.get({ id: 'Test.warehouse', dm: '测试测试' }, null, { cookie: 'giwsLang' });
// const lang = getLocale();

// const errMap = {
//   FailedLoginException: $i18n.get({ id: 'IncorrectAccountOrPassword.four_px', dm: '帐号或密码不正确' }),
//   AccountNotFoundException: $i18n.get({ id: 'TheAccountCannotBeFound.four_px', dm: '帐号找不到' }),
//   PreventedException: $i18n.get({ id: 'DatabaseQueryError.four_px', dm: '数据库查询出错' }),
//   GeneralSecurityException: $i18n.get({
//     id: 'AnErrorOccurredWhileConfiguringProject_1998406670.four_px',
//     dm: '项目认证配置出错',
//   }),
//   PasswordValidException: $i18n.get({
//     id: 'ThePasswordStrengthIsTooWeak_2612891633.four_px',
//     dm: '密码强度太弱，需要重置密码',
//   }),
//   InvalidLoginTimeException: $i18n.get({
//     id: 'TooManyLogonAttemptsPleaseTry_2760444533.four_px',
//     dm: '登陆尝试次数过多，请1小时后再尝试',
//   }),
// };

const appConfig: IAppConfig = {
  router: {
    type: 'browser',
  },

  request: {
    // baseURL: process.env.NODE_ENV === 'development' ? GATEWAY_URL : GATEWAY_URL,
    // 可选的，全局设置 request 是否返回 response 对象，默认为 false
    withFullResponse: false,
    withCredentials: true,
    // 拦截器
    interceptors: {
      request: {
        onConfig: (config) => {
          // 发送请求前：可以对 RequestConfig 做一些统一处理
          // 登录接口,钉钉接口不需要加headers
          if (/(v1\/tickets)|(cas\?ticket)|(v1\/dingtalk\/qrcode)/.test(config.url!)) {
            return config;
          }
          config.headers = {
            ...config.headers,
            'Accept-Language': getLocale() === 'zh-CN' ? 'zh-CN,zh' : 'en-US,en',
          };

          return config;
        },
        onError: (error) => {
          return Promise.reject(error);
        },
      },

      response: {
        onConfig: (response) => {
          // 请求成功：可以做全局的 toast 展示，或者对 response 做一些格式化
          // 登录获取ticket或者钉钉登录获取qrcode_url返回参数处理
          if (/(v1\/tickets\/)|(v1\/dingtalk\/qrcode)/.test(response.config.url!)) {
            const data = {
              result: '1',
              data: response.data,
            };

            return data;
          }
          // 登录cas
          if (/cas\?ticket/.test(response.config.url!)) {
            if (response.data.result === '1') {
              localStorage.setItem('session', response.data.session);
              localStorage.setItem('user', JSON.stringify(response.data.user));
              return response.data;
            }
          }
          // 登陆状态失效
          if (['9001', '9002', '9003'].includes(response.data.result)) {
            Message.error(
              response.data.errorMsg ||
                $i18n.get({ id: 'TheLogonStatusIsInvalidPlease_1360111661.four_px', dm: '登陆状态失效，请重新登录' }),
            );
            setTimeout(() => {
              window.location.href = '/user/login';
            }, 500);
            return Promise.reject(response.data);
          }
          // 导出数据流处理
          if (response.headers['content-type'].includes('application/octet-stream')) {
            return response;
          }
          // 普通请求
          if (response.data.result && response.data.result.toString() === '1') {
            return response.data;
          } else if (response.data.success === true) {
            return response.data;
          }
          Message.error(response.data.msg || $i18n.get({ id: 'TheOperationFailed.four_px', dm: '操作失败' }));
          return Promise.reject(response);
        },
        onError: (err) => {
          if (err && err.response && err.response.status) {
            switch (err.response.status) {
              case 400:
                err.message = $i18n.get({ id: 'ErrorRequest.four_px', dm: '错误请求' });
                break;
              case 401:
                if (err.response.data && err.response.data.authentication_exceptions) {
                  err.message = errMap[err.response.data.authentication_exceptions[0]];
                } else {
                  err.message = $i18n.get({ id: 'IncorrectAccountPassword.four_px', dm: '账号密码错误' });
                }
                break;
              case 403:
                err.message = $i18n.get({ id: 'AccessDenied.four_px', dm: '拒绝访问' });
                break;
              case 404:
                err.message = $i18n.get({
                  id: 'TheErrorMessageReturnedBecauseThe_361748264.four_px',
                  dm: '请求错误，未找到该资源',
                });
                break;
              case 405:
                err.message = $i18n.get({ id: 'TheRequestMethodIsNotAllowed.four_px', dm: '请求方法未允许' });
                break;
              case 408:
                err.message = $i18n.get({ id: 'RequestTimeout.four_px', dm: '请求超时' });
                break;
              case 500:
                err.message = $i18n.get({ id: 'ServerSideError.four_px', dm: '服务器端出错' });
                break;
              case 501:
                err.message = $i18n.get({ id: 'NetworkNotImplemented.four_px', dm: '网络未实现' });
                break;
              case 502:
                err.message = $i18n.get({ id: 'NetworkError.four_px', dm: '网络错误' });
                break;
              case 503:
                err.message = $i18n.get({ id: 'ServiceUnavailable.four_px', dm: '服务不可用' });
                break;
              case 504:
                err.message = $i18n.get({ id: 'NetworkTimeout.four_px', dm: '网络超时' });
                break;
              case 505:
                err.message = $i18n.get({
                  id: 'TheHttpVersionDoesNotSupport_2785595950.four_px',
                  dm: 'http版本不支持该请求',
                });
                break;
              default:
                err.message = $i18n.get({ id: 'ConnectionError.four_px', dm: '连接错误' });
            }
          } else {
            err.message = $i18n.get({ id: 'FailedToConnectToTheServer.four_px', dm: '连接到服务器失败' });
          }
          Message.error(err.message);
          return Promise.reject(err);
        },
      },
    },
  },

  app: {
    rootId: 'ice-container',
    addProvider: ({ children }) => (
      <Sentry.ErrorBoundary>
        <LocaleProvider locale={lang}>{children}</LocaleProvider>
      </Sentry.ErrorBoundary>
    ),
  },
};

// 本地开发环境 不上报
if (['stage', 'prod', 'eu', 'us'].includes(APP_MODE)) {
  Sentry.init({
    dsn: 'http://9f64fba5b0b14825a564c5df31222f01@123.58.43.40:9000/2',
    tracesSampleRate: 1.0,
    release: `giws-${APP_MODE}-${packageJson.version}`,
    environment: APP_MODE, // 环境参数
    beforeSend(event) {
      // 正常请求result === 0的时候 不上报
      if (event.extra) {
        return null;
      }
      return event;
    },
  });
}

runApp(appConfig);
