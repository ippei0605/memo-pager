# Memo with pager

## はじめに
このアプリケーションは、Node.js、Cloudant NoSQL DB でページネーション実装の検証のために作成しました。  
Memo アプリ にページャー機能 (前のページ、次のページで遷移) を付加しました。
Memo アプリについては以下のサイトを参照してください。  
<https://github.com/ippei0605/memo>

Cloudant NoSQL DB のページネーションの仕組みについては、Pagination Recipe を参考にしました。
<http://docs.couchdb.org/en/1.6.1/couchapp/views/pagination.html>


## セットアップ
1. 本サイトから Memo with pager アプリをダウンロード (Download ZIP) して解凍してください。ディレクトリ名は memo-pager-master から memo-pager に変更してください。

1. Bluemix コンソールから CFアプリケーション (Node.js) を作成してください。  
アプリケーション名: memo-pager-ippei (任意)  

    > 以降、memo-pager-ippei で説明します。


1. CF コマンド・ライン・インターフェースをインストールしていない場合は、インストールしてください。

1. Cloudant NoSQL DB を作成し、memo-pager-ippei にバインドしてください。  
サービス名: Cloudant NoSQL DB-cc (固定)  

    > 名前を変更したい場合は、 utils/context.js の CLOUDANT_SERVICE_NAME の設定値を変更してください。

1. 解凍したディレクトリ (memoアプリのホーム) に移動してください。

        > cd memo

1. Bluemixに接続してください。

        > cf api https://api.ng.bluemix.net
    

1. Bluemix にログインしてください。

        > cf login -u e87782@jp.ibm.com -o e87782@jp.ibm.com -s dev

1. アプリをデプロイしてください。

        > cf push memo-pager-ippei

1. ご使用のブラウザーで以下の URL を入力して、アプリにアクセスしてください。

        memo-pager-ippei.mybluemix.net


## ファイル構成
    memo
    │  .cfignore
    │  .gitignore
    │  app.js                 Memo with pager アプリ
    │  package.json
    │  README.md
    │  
    ├─install
    │      memo.map           Cloudant NoSQL DB のビューのマップファンクション
    │      postinstall.js     Memo with pager アプリのインストール後処理
    │      
    ├─models
    │      memo.js            Memo with pager アプリのモデル
    │      
    ├─public
    │      favicon.ico
    │      
    ├─routes
    │      index.js           Memo with pager アプリのルーティング
    │      
    ├─utils
    │      context.js         Memo with pager アプリのコンテキスト
    │      
    └─views
            index.ejs         メモ一覧表示画面、新規登録・更新ダイアログ


## ルート (URLマッピング)
|Action|Method|処理|
|---|-----------|-----------|
|/|GET|メモ一覧表示|
|/memos|POST|メモ新規登録、処理後 / にリダイレクト|
|/memos/:_id/:_rev|POST|メモ更新、処理後 / にリダイレクト|
|/memos/:_id/:_rev/delete|POST|メモ削除、処理後 / にリダイレクト|


## Memo アプリからの変更点
* ページャーをアドオンしました。概要を以下に示します。
 * モデル (memo.js) にページ制御のためのロジックを実装
 * ページインデックスの保管にセッションを使用 (express-session)
 * セッションの保管先に Cloudant NoSQL DB を使用 (connect-cloudant)
* その他
 * メモ新規登録および更新ダイアログをサーバ送信せず、クライアントのみの制御に変更しました。
 * 上記に伴い、マップファンクションは全項目を取得するように変更しました。


## まとめ
Pagination Recipe の通り、次の方法で実装することがデータベースアクセスを極小化できて効率的です。

* 次のページは1個多く読込み startkey にセット
* 前のページは保存した 前回の startkey を使用

前のページは複数あるので、ページ番号と startkey の配列 (ページインデックス) をセッションに保管するのが良いと思います。  
ページインデックスを使用せず、ビュー操作のみで前のページへの遷移が実現できないかを検討しましたが、startkey 未指定、endkey だけの検索では期待する件数を取得することができませんでした。
startkey を指定し昇順 (メモは降順で表示) で取得したリストを降順にソートしなおせば、ページインデックスは不要ですが非効率なので採用しませんでした。
Google の検索結果のようなページネーション (1,2,...,n ページ) を実現するには、ビューパラメータ skip で読み飛ばすしか方法がなさそうです。一度検索したページと次のページをインデックスに保管する方法と組合わせることで少しは効率化が図れそうですが、SQLの行指定のような効果的な方法ななさそうです。ベターなプラクティスになりそうもないのでページネーションは実装しないことにしました。





