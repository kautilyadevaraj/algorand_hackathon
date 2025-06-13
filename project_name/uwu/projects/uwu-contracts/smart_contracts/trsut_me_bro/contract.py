from algopy import *
from algopy.arc4 import abimethod


class TrustMeBro(ARC4Contract):
    assetid: UInt64
    unitaryprice: UInt64

    #create the app
    @abimethod(allow_actions=["NoOp"], create="require")
    def create_application(self, asset_id: Asset, unitary_price: UInt64) -> None:
        self.assetid = asset_id.id
        self.unitaryprice = unitary_price
        return asset_id

    #update the listing price
    @abimethod()
    def set_price(self, unitary_price: UInt64) -> None:
        assert Txn.sender == Global.creator_address
        self.unitaryprice = unitary_price

    # opt in to the asset that will be sold. this is for the contract to opt in to asset
    @abimethod()
    def opt_in_to_asset(self, mbrpay: gtxn.PaymentTransaction) -> None:
        assert Txn.sender == Global.creator_address
        assert not Global.current_application_address.is_opted_in(Asset(self.assetid))

        assert mbrpay.receiver == Global.current_application_address

        assert mbrpay.amount == Global.min_balance + Global.asset_opt_in_min_balance

        itxn.AssetTransfer(
            xfer_asset= self.assetid,
            asset_receiver= Global.current_application_address,
            asset_amount= 0,
        ).submit()
        
    # for the user to opt in to the asset
    @abimethod()
    def user_opt_in(self) -> None:
        itxn.AssetTransfer(
            xfer_asset=self.assetid,
            asset_receiver=Txn.sender,
            asset_amount=0
        ).submit()
