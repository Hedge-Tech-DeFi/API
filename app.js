const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const config = require('./config.json');

const walletPrivateKey = process.env.walletPrivateKey;

const web3Rinkeby = new Web3('https://rinkeby.infura.io/v3/01d5d39c9b47480c929bbf0ba8796713');
const web3BSC = new Web3('https://bsc-dataseed1.binance.org:443');
const web3Mainnet = new Web3("https://mainnet.infura.io/v3/01d5d39c9b47480c929bbf0ba8796713");


web3Rinkeby.eth.accounts.wallet.add(config.walletPrivateKey);
const myWalletAddressRinkeby = web3Rinkeby.eth.accounts.wallet[0].address;

const GovAlphaAbi = config.GovAlphaAbi;

const GovAlphaMainnet = config.GovAlphaMainnet;
const GovAlphaMainnetContract = new web3Mainnet.eth.Contract(GovAlphaAbi, GovAlphaMainnet);

const GovAlphaRinkeby = config.GovAlphaRinkeby;
const GovAlphaRinkebyContract = new web3Rinkeby.eth.Contract(GovAlphaAbi, GovAlphaRinkeby);

const VaultAbi = config.VaultAbi;

const VaultAbiMainnet = config.VaultMainnet;
const VaultAbiMainnetContract = new web3BSC.eth.Contract(VaultAbi, VaultAbiMainnet);

const VaultAbiRinkeby = config.VaultRinkeby;
const VaultAbiRinkebyContract = new web3Rinkeby.eth.Contract(VaultAbi, VaultAbiRinkeby);

const app = express();
const port = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Rinkeby routes

app.route('/rinkeby/proposal/:id/state').get((req, res) => {
  GovAlphaRinkebyContract.methods.state(req.params.id).call()
    .then((result) => {
      proposal = result;
      return res.send(proposal);
    })
    .catch((error) => {
      console.error('[rinkeby-proposal-state] error:', error);
      return res.sendStatus(400);
    });
});

app.route('/rinkeby/proposal/:id').get((req, res) => {
  GovAlphaRinkebyContract.getPastEvents('ProposalCreated', {
    filter: {}, // Using an array means OR: e.g. 20 or 23
    fromBlock: 0,
    toBlock: 'latest'
  }, function(error, events){ 
    console.log(events); 
  })
  .then(events => {
    const proposals = events.map(function(events) {
      returnValues = events.returnValues;
      returnObj = {
        title: "Proposal #" + returnValues.id,
        id: returnValues.id,
        proposer: returnValues.proposer,
        startBlock: returnValues.startBlock,
        endBlock: returnValues.endBlock,
        description: returnValues.description,
      }
      return returnObj;
    });
    const proposal = proposals.filter(proposal => proposal.id === req.params.id);
    return res.send(proposal[0]);
  })
  .catch((error) => {
    console.error('[rinkeby-proposal-id] error:', error);
    return res.sendStatus(400);
  });
});


app.route('/rinkeby/proposals/').get((req, res) => {
  GovAlphaRinkebyContract.getPastEvents('ProposalCreated', {
    filter: {}, // Using an array means OR: e.g. 20 or 23
    fromBlock: 0,
    toBlock: 'latest'
  }, function(error, events){ 
    console.log(events); 
  })
  .then(events => {
    const proposals = events.map(function(events) {
      returnValues = events.returnValues;
      returnObj = {
        title: "Proposal #" + returnValues.id,
        id: returnValues.id,
        proposer: returnValues.proposer,
        startBlock: returnValues.startBlock,
        endBlock: returnValues.endBlock,
        description: returnValues.description,
      }
      return returnObj;
    });
    return res.send(proposals);
  })
  .catch((error) => {
    console.error('[rinkeby-proposals] error:', error);
    return res.sendStatus(400);
  });
});

app.route('/rinkeby/vault/etherbalance/').get((req, res) => {
  VaultAbiRinkebyContract.methods.getVaultETHBalance().call()
    .then((result) => {
      etherbalance = result;
      return res.send(etherbalance);
    })
    .catch((error) => {
      console.error('[rinkeby-etherbalance] error:', error);
      return res.sendStatus(400);
    });
});

app.route('/rinkeby/vault/circulatingsupply/').get((req, res) => {
  VaultAbiRinkebyContract.methods.getCirculatingSupply().call()
    .then((result) => {
      circulatingsupply = result;
      return res.send(circulatingsupply);
    })
    .catch((error) => {
      console.error('[rinkeby-circulatingsupply] error:', error);
      return res.sendStatus(400);
    });
});

// Mainnet routes

app.route('/mainnet/proposal/:id/state').get((req, res) => {
  GovAlphaMainnetContract.methods.state(req.params.id).call()
    .then((result) => {
      proposal = result;
      return res.send(proposal);
    })
    .catch((error) => {
      console.error('[mainnet-proposal-state] error:', error);
      return res.sendStatus(400);
    });
});

app.route('/mainnet/proposal/:id').get((req, res) => {
  GovAlphaMainnetContract.getPastEvents('ProposalCreated', {
    filter: {}, // Using an array means OR: e.g. 20 or 23
    fromBlock: 0,
    toBlock: 'latest'
  }, function(error, events){ 
    console.log(events); 
  })
  .then(events => {
    const proposals = events.map(function(events) {
      returnValues = events.returnValues;
      returnObj = {
        title: "Proposal #" + returnValues.id,
        id: returnValues.id,
        proposer: returnValues.proposer,
        startBlock: returnValues.startBlock,
        endBlock: returnValues.endBlock,
        description: returnValues.description,
      }
      return returnObj;
    });
    const proposal = proposals.filter(proposal => proposal.id === req.params.id);
    return res.send(proposal[0]);
  })
  .catch((error) => {
    console.error('[mainnet-proposal-id] error:', error);
    return res.sendStatus(400);
  });
});

app.route('/mainnet/proposals/').get((req, res) => {
  GovAlphaMainnetContract.getPastEvents('ProposalCreated', {
    filter: {}, // Using an array means OR: e.g. 20 or 23
    fromBlock: 0,
    toBlock: 'latest'
  }, function(error, events){ 
    console.log(events); 
  })
  .then(events => {
    const proposals = events.map(function(events) {
      returnValues = events.returnValues;
      returnObj = {
        title: "Proposal #" + returnValues.id,
        id: returnValues.id,
        proposer: returnValues.proposer,
        startBlock: returnValues.startBlock,
        endBlock: returnValues.endBlock,
        description: returnValues.description,
      }
      return returnObj;
    });
    return res.send(proposals);
  })
  .catch((error) => {
    console.error('[mainnet-proposals] error:', error);
    return res.sendStatus(400);
  });
});

app.route('/mainnet/vault/etherbalance/').get((req, res) => {
  VaultAbiMainnetContract.methods.getVaultETHBalance().call()
    .then((result) => {
      etherbalance = result;
      return res.send(etherbalance);
    })
    .catch((error) => {
      console.error('[mainnet-etherbalance] error:', error);
      return res.sendStatus(400);
    });
});

app.route('/mainnet/vault/circulatingsupply/').get((req, res) => {
  VaultAbiMainnetContract.methods.getCirculatingSupply().call()
    .then((result) => {
      circulatingsupply = result;
      return res.send(circulatingsupply);
    })
    .catch((error) => {
      console.error('[mainnet-circulatingsupply] error:', error);
      return res.sendStatus(400);
    });
});

app.listen(port, () => console.log(`API server running on port ${port}`));
